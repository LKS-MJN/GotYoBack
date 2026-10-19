with open('src/views/IoTLab.tsx', 'r', encoding='utf-8') as f:
    c = f.read()

# Fix: add closing div for the extra wrapper I added
old = '''          <Button variant="outline" onClick={() => { setSim(resetIoT()); counted.current = false }} aria-label="Reset">
            <RotateCcw aria-hidden /> Reset
          </Button>
        </div>
      </header>'''
new = '''          <Button variant="outline" onClick={() => { setSim(resetIoT()); counted.current = false }} aria-label="Reset">
            <RotateCcw aria-hidden /> Reset
          </Button>
          </div>
        </div>
      </header>'''
if old in c:
    c = c.replace(old, new)
    print("fixed closing div")
else:
    print("pattern not found, checking current structure")
    # Find the reset button end
    idx = c.find('Reset</Button>')
    print(repr(c[idx:idx+120]))

with open('src/views/IoTLab.tsx', 'w', encoding='utf-8') as f:
    f.write(c)