
import json, base64, hashlib, random
from dataclasses import dataclass
from typing import Dict, List, Tuple
from cryptography.hazmat.primitives.asymmetric.ed25519 import Ed25519PrivateKey
from cryptography.exceptions import InvalidSignature
from cryptography.hazmat.primitives import serialization

def digest(payload: bytes) -> str:
    return hashlib.sha256(payload).hexdigest()

def b64(b: bytes) -> str:
    return base64.b64encode(b).decode("utf-8")

@dataclass
class Node:
    i: int
    priv: Ed25519PrivateKey
    pub_bytes: bytes  # raw public bytes

    def sign(self, msg: bytes) -> bytes:
        return self.priv.sign(msg)

def make_nodes(n: int) -> List[Node]:
    nodes=[]
    for i in range(n):
        priv=Ed25519PrivateKey.generate()
        pub=priv.public_key().public_bytes(encoding=serialization.Encoding.Raw, format=serialization.PublicFormat.Raw)
        nodes.append(Node(i=i, priv=priv, pub_bytes=pub))
    return nodes

# minimal verify using stored pub bytes
from cryptography.hazmat.primitives.asymmetric.ed25519 import Ed25519PublicKey
def verify(pub_bytes: bytes, sig: bytes, msg: bytes) -> bool:
    try:
        Ed25519PublicKey.from_public_bytes(pub_bytes).verify(sig, msg)
        return True
    except InvalidSignature:
        return False

def pbft_sim(n=4, f=1, faulty_node=3):
    # condition: n >= 3f+1
    assert n >= 3*f+1
    nodes=make_nodes(n)
    pubs={nd.i: nd.pub_bytes for nd in nodes}

    payload=b"transfer:amount=10:to=Bob"
    d_good=digest(payload)
    d_bad=digest(b"transfer:amount=1000:to=Eve")

    primary=0
    # PRE-PREPARE: primary sends digest; faulty node may see conflicting view (simulate by sending bad digest to one honest)
    preprepare: Dict[int,str]={}
    for i in range(n):
        if i==faulty_node:
            preprepare[i]=d_bad  # byzantine lies to itself
        else:
            preprepare[i]=d_good

    # PREPARE phase: each node broadcasts prepare(digest) signed
    prepares: Dict[int, List[Tuple[int,str,bytes]]] = {i: [] for i in range(n)}
    for sender in range(n):
        d = preprepare[sender]
        msg = f"PREPARE|{sender}|{d}".encode()
        sig = nodes[sender].sign(msg)
        for recv in range(n):
            prepares[recv].append((sender,d,sig))

    # Faulty node additionally forges conflicting prepares to subset
    # Send bad digest prepare to node 1 only
    msg = f"PREPARE|{faulty_node}|{d_bad}".encode()
    sig = nodes[faulty_node].sign(msg)
    prepares[1].append((faulty_node,d_bad,sig))

    # Each node counts valid prepares for a digest (including itself). Need 2f+1 prepares to move to commit.
    threshold = 2*f + 1
    prepared_digest: Dict[int,str] = {}
    prepare_counts: Dict[int, Dict[str,int]] = {}
    for i in range(n):
        counts={}
        for (sender,d,sig) in prepares[i]:
            if verify(pubs[sender], sig, f"PREPARE|{sender}|{d}".encode()):
                counts[d]=counts.get(d,0)+1
        prepare_counts[i]=counts
        # choose digest with max count meeting threshold
        best = max(counts.items(), key=lambda kv: kv[1])
        if best[1] >= threshold:
            prepared_digest[i]=best[0]

    # COMMIT phase: nodes that are prepared broadcast commit for their prepared digest
    commits: Dict[int, List[Tuple[int,str,bytes]]] = {i: [] for i in range(n)}
    for sender in range(n):
        if sender in prepared_digest:
            d = prepared_digest[sender]
            msg = f"COMMIT|{sender}|{d}".encode()
            sig = nodes[sender].sign(msg)
            for recv in range(n):
                commits[recv].append((sender,d,sig))

    # Faulty node tries conflicting commit to node 2
    if faulty_node in prepared_digest:
        msg = f"COMMIT|{faulty_node}|{d_bad}".encode()
        sig = nodes[faulty_node].sign(msg)
        commits[2].append((faulty_node,d_bad,sig))

    # Finalization: need 2f+1 commits for same digest
    committed: Dict[int,str] = {}
    commit_counts: Dict[int, Dict[str,int]] = {}
    for i in range(n):
        counts={}
        for (sender,d,sig) in commits[i]:
            if verify(pubs[sender], sig, f"COMMIT|{sender}|{d}".encode()):
                counts[d]=counts.get(d,0)+1
        commit_counts[i]=counts
        if counts:
            best=max(counts.items(), key=lambda kv: kv[1])
            if best[1] >= threshold:
                committed[i]=best[0]

    # Safety claim: all honest nodes that commit must commit same digest (d_good)
    honest=[i for i in range(n) if i!=faulty_node]
    committed_honest={i:committed.get(i) for i in honest}
    unique=set(v for v in committed_honest.values() if v is not None)
    safety_ok=(len(unique)<=1) and (list(unique)[0]==d_good if unique else True)

    out={
        "params":{"n":n,"f":f,"faulty":faulty_node,"threshold_2f1":threshold},
        "digest_good":d_good,
        "digest_bad":d_bad,
        "prepare_counts":prepare_counts,
        "prepared_digest":prepared_digest,
        "commit_counts":commit_counts,
        "committed":committed,
        "committed_honest":committed_honest,
        "safety_honest_commit_same_digest":safety_ok
    }
    return out

def main():
    out=pbft_sim()
    print(json.dumps(out, indent=2))

if __name__=="__main__":
    main()
