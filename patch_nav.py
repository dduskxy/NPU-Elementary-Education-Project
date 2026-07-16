import os
import re

target_dir = r"C:\Users\asus\web_project"
html_files = [f for f in os.listdir(target_dir) if f.endswith('.html')]

pattern = re.compile(r'(<div class="nav-brand">.*?</div>)\s*(<div class="nav-menu">)', re.DOTALL)

for file in html_files:
    filepath = os.path.join(target_dir, file)
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()
    
    if '<div class="nav-toggle">' not in content:
        new_content = pattern.sub(r'\1\n    <div class="nav-toggle"><div class="hamburger"></div></div>\n    \2', content)
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(new_content)
        print(f"Updated {file}")
