
import json, base64
from cryptography.hazmat.primitives.asymmetric.ed25519 import Ed25519PrivateKey
from cryptography.exceptions import InvalidSignature

def b64(b: bytes) -> str:
    return base64.b64encode(b).decode("utf-8")

def main():
    msg = b"obsidia-bank-proof:commit-digest=abc123"
    priv = Ed25519PrivateKey.generate()
    pub = priv.public_key()
    sig = priv.sign(msg)

    # verify ok
    ok=True
    try:
        pub.verify(sig, msg)
    except InvalidSignature:
        ok=False

    # corrupt sig (flip 1 bit)
    sig_bad = bytearray(sig)
    sig_bad[0] ^= 0x01
    sig_bad = bytes(sig_bad)

    bad_ok=True
    try:
        pub.verify(sig_bad, msg)
    except InvalidSignature:
        bad_ok=False

    out = {
        "verify_original_signature": ok,
        "verify_corrupted_signature": bad_ok,
        "signature_b64": b64(sig),
        "corrupted_signature_b64": b64(sig_bad),
        "message": msg.decode("utf-8"),
    }
    print(json.dumps(out, indent=2))

if __name__ == "__main__":
    main()
