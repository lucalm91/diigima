import os
import re

# Logic to choose contact href
def get_contact_href(content):
    if 'id="contact"' in content:
        return '#contact'
    return 'https://diigima.es/#contact'

def update_file(filepath):
    print(f"Processing {filepath}...")
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
    except Exception as e:
        print(f"Error reading {filepath}: {e}")
        return

    original_content = content
    contact_href = get_contact_href(content)

    # 1. Update Desktop Nav
    # We look for the start of the list, and match everything until the start of the CTA button or the closing div of nav-content
    # This prevents short-circuiting on nested </ul>
    
    # Locate where the nav starts
    # We expect: ... <div class="nav-content"> ... <a class="nav-logo">...</a> [TARGET AREA] <a class="nav-cta-desktop">...</a> </div>
    
    # This regex attempts to find the NAV LINKS block by looking for the logo before it, and the CTA or Div end after it.
    desktop_regex = r'(<a href="[^"]+" class="nav-logo">.*?</a>\s*)(.*?)(?=\s*<a href="[^"]+"[^>]*class="nav-cta-desktop">)'
    
    desktop_match = re.search(desktop_regex, content, re.DOTALL)
    
    if desktop_match:
        prefix = desktop_match.group(1) # The logo
        
        # New Nav Content
        new_nav = f'''<ul class="nav-links">
	<li class="dropdown">
		<a href="https://diigima.es/#our-services">OUR SERVICES</a>
		<ul class="dropdown-menu">
			<li><a href="/trailers">TRAILERS</a></li>
			<li><a href="/films">FILMS</a></li>
			<li><a href="/plays">PLAYS</a></li>
			<li><a href="/events">EVENTS</a></li>
			<li><a href="/interviews">INTERVIEWS</a></li>
		</ul>
	</li>
	<li><a href="https://diigima.es/#success-stories">SUCCESS STORIES</a></li>
	<li><a href="https://diigima.es/#how-we-work">HOW WE WORK</a></li>
	<li><a href="https://diigima.es/#about-us">ABOUT DIIGIMA</a></li>
	<li><a href="{contact_href}">CONTACT US</a></li>
</ul>'''
        # Replace the middle part (the old UL mess) with the new nav
        replacement = prefix + "\n\t\t\t" + new_nav + "\n\t\t\t"
        
        # We replace the whole match
        content = content.replace(desktop_match.group(0), replacement)
    
    else:
        # Fallback if regex failed (maybe CTA is missing?)
        # Try matching until </div>
        desktop_regex_no_cta = r'(<a href="[^"]+" class="nav-logo">.*?</a>\s*)(.*?)(?=\s*</div>)'
        # Caution: this might be too greedy if there are other divs, but nav-content usually closes soon.
        # Let's try matching <ul class="nav-links"> explicitly if the above failed
        # and match until the LAST </ul> before nav-cta or div end.
        pass


    # 2. Update Mobile Menu Toggle (Insert CTA)
    # Check if CTA is there or needs update. 
    # Current requirement: "remove the download brochure button on mobile navbar for now"
    # User asked for this previously. CSS hides it (.nav-cta-mobile { display: none !important; }).
    # But we can keep it in HTML or remove it. Let's start with cleaning the broken HTML.
    
    # 3. Update Mobile Menu Content
    # We look for the <div class="mobile-menu-content"> ... </div>
    # Inside we want to replace the <ul>...</ul> block.
    # The block is between the logo and "close-menu-bottom" (or end of div)
    
    mobile_content_regex = r'(<div class="mobile-menu-content">.*?<a href="[^"]+" class="mobile-nav-logo">.*?</a>\s*)(.*?)(?=\s*<div class="close-menu-bottom">)'
    
    mobile_match = re.search(mobile_content_regex, content, re.DOTALL)
    if mobile_match:
        prefix = mobile_match.group(1)
        
        new_mobile_ul = f'''<ul>
				<li class="dropdown">
					<a href="https://diigima.es/#our-services">OUR SERVICES</a>
					<ul class="dropdown-menu">
						<li><a href="/trailers">TRAILERS</a></li>
						<li><a href="/films">FILMS</a></li>
						<li><a href="/plays">PLAYS</a></li>
						<li><a href="/events">EVENTS</a></li>
						<li><a href="/interviews">INTERVIEWS</a></li>
					</ul>
				</li>
				<li><a href="https://diigima.es/#success-stories">SUCCESS STORIES</a></li>
				<li><a href="https://diigima.es/#how-we-work">HOW WE WORK</a></li>
				<li><a href="https://diigima.es/#about-us">ABOUT DIIGIMA</a></li>
				<li><a href="{contact_href}">CONTACT US</a></li>
			</ul>'''
        
        content = content.replace(mobile_match.group(0), prefix + "\n\t\t\t" + new_mobile_ul + "\n\t\t\t")


    if content != original_content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated {filepath}")
    else:
        print(f"No changes (or match failed) for {filepath}")

root_dir = r'w:\diigima'
for dirpath, dirnames, filenames in os.walk(root_dir):
    for filename in filenames:
        if filename == 'index.html':
            filepath = os.path.join(dirpath, filename)
            # Skip main index.html as it is already edited manually and might have differ structure (relative links)
            if filepath.lower() == os.path.join(root_dir, 'index.html').lower():
                continue
            # Skip 404 if it's special? 404 probably needs home links.
            update_file(filepath)
