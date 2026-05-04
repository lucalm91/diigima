import os

filepath = 'w:/diigima/index.html'

def update_index_html():
    print(f"Reading {filepath}...")
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
    except Exception as e:
        print(f"Error reading path: {e}")
        return

    original_content = content
    
    # Replace Navigation Links (Global replace for identical lines)
    content = content.replace('<li><a href="#success-stories">SUCCESS STORIES</a></li>', '<li><a href="#projects">PROJECTS</a></li>')
    
    # Replace Section ID and related comments/headings
    content = content.replace('<!-- Success Stories -->', '<!-- Projects -->')
    content = content.replace('<article id="success-stories">', '<article id="projects">')
    content = content.replace('<h2 class="major">Success Stories</h2>', '<h2 class="major">Projects</h2>')
    
    # Replace Text References
    content = content.replace('detailing our services and success stories', 'detailing our services and projects')
    
    # Replace other links pointing to hash
    content = content.replace('href="#success-stories"', 'href="#projects"')

    if content != original_content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print("Successfully updated index.html")
    else:
        print("No changes needed for index.html")

if __name__ == "__main__":
    update_index_html()
