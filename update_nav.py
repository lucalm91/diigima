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
    # We strip previous indentation in replacement, handled by regex group if we want precise
    # But for HTML, strict whitespace matching isn't required as long as it looks okay.
    
    # We'll try to detect indentation of the UL
    nav_match = re.search(r'(\s*)<ul class="nav-links">.*?</ul>', content, re.DOTALL)
    
    if nav_match:
        indent = nav_match.group(1)
        # Construct new UL with correct indentation
        new_nav = f'''<ul class="nav-links">
{indent}	<li class="dropdown">
{indent}		<a href="https://diigima.es/#our-services">OUR SERVICES</a>
{indent}		<ul class="dropdown-menu">
{indent}			<li><a href="/trailers">TRAILERS</a></li>
{indent}			<li><a href="/films">FILMS</a></li>
{indent}			<li><a href="/plays">PLAYS</a></li>
{indent}			<li><a href="/events">EVENTS</a></li>
{indent}			<li><a href="/interviews">INTERVIEWS</a></li>
{indent}		</ul>
{indent}	</li>
{indent}	<li><a href="https://diigima.es/#success-stories">SUCCESS STORIES</a></li>
{indent}	<li><a href="https://diigima.es/#how-we-work">HOW WE WORK</a></li>
{indent}	<li><a href="https://diigima.es/#about-us">ABOUT DIIGIMA</a></li>
{indent}	<li><a href="{contact_href}">CONTACT US</a></li>
{indent}</ul>'''

        # CTA
        cta_html = f'\n{indent}<a href="{contact_href}" class="nav-cta-desktop">CONTACT</a>'
        
        # Determine replacement
        # If CTA already exists, don't add it again to the replacement block if we are replacing UL
        if 'class="nav-cta-desktop"' in content:
            # CTA exists, assume we just update UL
            replacement = new_nav
        else:
            replacement = new_nav + cta_html

        content = content.replace(nav_match.group(0), replacement)

    # 2. Update Mobile Menu Toggle (Insert CTA)
    if 'class="nav-cta-mobile"' not in content:
        # Indentation guess
        toggle_match = re.search(r'(\s*)<div id="mobile-menu-toggle">', content)
        if toggle_match:
            indent = toggle_match.group(1)
            content = content.replace(toggle_match.group(0), f'{indent}<a href="{contact_href}" class="nav-cta-mobile">CONTACT</a>\n\n{indent}<div id="mobile-menu-toggle">')
    
    # 3. Update Mobile Menu Content
    # Find UL inside mobile-menu-content.
    # Regex: (<div class="mobile-menu-content">.*?<a href=.*?</a>\s*)(<ul>.*?</ul>)
    mobile_match = re.search(r'(<div class="mobile-menu-content">.*?<a href=.*?</a>\s*)(<ul>.*?</ul>)', content, re.DOTALL)
    if mobile_match:
        prefix = mobile_match.group(1)
        old_ul = mobile_match.group(2)
        # Use same nav logic but for mobile
        # Indentation from match
        # We can just construct a simple UL
        # Logic: 4 tabs indentation usually?
        
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
        
        content = content.replace(mobile_match.group(0), prefix + new_mobile_ul)

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
