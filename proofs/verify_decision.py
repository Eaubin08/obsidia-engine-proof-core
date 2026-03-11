import json
import sys
import nacl.signing
import nacl.encoding

def verify(file_path):
    with open(file_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    entry_hash = data["audit"]["entry_hash"]
    signature = bytes.fromhex(data["audit"]["signature"])
    public_key = data["audit"]["public_key"]

    verify_key = nacl.signing.VerifyKey(public_key, encoder=nacl.encoding.HexEncoder)
    verify_key.verify(entry_hash.encode(), signature)

    print("Signature VALID")

if __name__ == "__main__":
    verify(sys.argv[1])
