import re

PHONE_RE = re.compile(r"\+?\d[\d\s().-]{8,}")

test_texts = [
    "Phone: +1 (555) 123-4567",
    "Mobile: 987-654-3210",
    "Call me at 555-1234",
    "+91 9876543210",
]

for text in test_texts:
    match = PHONE_RE.search(text)
    if match:
        print(f"✅ Found: '{match.group(0)}' in '{text}'")
    else:
        print(f"❌ NOT found in '{text}'")