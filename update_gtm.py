import os
import re

root_dir = 'w:\\diigima'
gtm_head = """<!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-TVF8S6FP');</script>
<!-- End Google Tag Manager -->"""

gtm_body = """<!-- Google Tag Manager (noscript) -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-TVF8S6FP"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<!-- End Google Tag Manager (noscript) -->"""

umami_pattern_simple = re.compile(r'<script\s+defer\s+src="/umami/script\.js".*?</script>', re.DOTALL | re.IGNORECASE)

def process_file(file_path):
    print(f"Processing {file_path}...")
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
    except UnicodeDecodeError:
        print(f"Skipping {file_path} due to encoding error.")
        return

    # Remove Umami
    new_content = umami_pattern_simple.sub('', content)
    
    # Check if GTM Head is present
    if "GTM-TVF8S6FP" not in new_content or "googletagmanager.com/gtm.js" not in new_content:
         # Find <head> or <head ...>
        head_match = re.search(r'<head.*?>', new_content, re.IGNORECASE | re.DOTALL)
        if head_match:
            insert_pos = head_match.end()
            new_content = new_content[:insert_pos] + '\n' + gtm_head + new_content[insert_pos:]
        else:
             print(f"Warning: <head> tag not found in {file_path}")
    else:
        print(f"GTM Head already present in {file_path}")

    # Check if GTM Body is present
    if "googletagmanager.com/ns.html" not in new_content:
        # Add GTM Body
        # Find <body> or <body ...>
        # . does not match newlines by default, dotall needed if tag matches across lines
        body_match = re.search(r'<body.*?>', new_content, re.IGNORECASE | re.DOTALL)
        if body_match:
            insert_pos = body_match.end()
            new_content = new_content[:insert_pos] + '\n' + gtm_body + new_content[insert_pos:]
            print(f"Added missing Body GTM to {file_path}")
        else:
            print(f"Warning: <body> tag not found in {file_path}")
    else:
        print(f"GTM Body already present in {file_path}")

    if new_content != content:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated {file_path}")
    else:
        print(f"No changes for {file_path}")

for root, dirs, files in os.walk(root_dir):
    for file in files:
        if file.endswith('.html'):
            file_path = os.path.join(root, file)
            process_file(file_path)
