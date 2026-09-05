const fs = require('fs');
let code = fs.readFileSync('src/app/contacts/page.tsx', 'utf8');

// 1. Add Filter and Sort icons
if (!code.includes('Filter')) {
  code = code.replace(/import \{([\s\S]*?)\} from 'lucide-react';/, "import { $1, Filter, ArrowDownUp, Tag } from 'lucide-react';");
}

// 2. Wrap search bar and add Filter & Sort buttons
const searchBarRegex = /<div className="relative max-w-2xl group">[\s\S]*?<\/div>\s*<\/div>/;
const newSearchUI = `
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-2xl group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
            <Search className="h-5 w-5" />
          </div>
          <input 
            type="text" 
            placeholder="Try 'Works at Google' or 'Lives in New York'..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-11 pr-32 py-3.5 bg-card border border-border/60 rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all shadow-sm outline-none"
          />
          <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
            <div className="flex items-center gap-1.5 bg-blue-500/10 text-blue-600 px-2.5 py-1 rounded-lg text-xs font-bold border border-blue-500/20">
              <Sparkles className="w-3 h-3" /> Smart Search
            </div>
          </div>
        </div>
        
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-3.5 bg-card border border-border/60 rounded-xl text-sm font-bold shadow-sm hover:bg-muted transition-colors whitespace-nowrap">
            <Filter className="w-4 h-4 text-muted-foreground" />
            Filters
          </button>
          <button className="flex items-center gap-2 px-4 py-3.5 bg-card border border-border/60 rounded-xl text-sm font-bold shadow-sm hover:bg-muted transition-colors whitespace-nowrap">
            <ArrowDownUp className="w-4 h-4 text-muted-foreground" />
            Sort By
          </button>
        </div>
      </div>
`;
code = code.replace(searchBarRegex, newSearchUI);

// 3. Rename "Status" to "Labels" in the table header
code = code.replace(
  /<th className="px-6 py-4 font-semibold text-muted-foreground uppercase tracking-wider text-\[11px\]">Status<\/th>/,
  '<th className="px-6 py-4 font-semibold text-muted-foreground uppercase tracking-wider text-[11px]">Labels</th>'
);

// 4. Update the "Status" column to render ALL tags, not just VIP
const tagsRegex = /<td className="px-6 py-4">\s*\{contact\.tags\?\.includes\('VIP'\) \? \([\s\S]*?Standard\s*<\/span>\s*\)\}\s*<\/td>/;
const newTagsRenderer = `<td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1.5">
                      {contact.tags && contact.tags.length > 0 ? (
                        contact.tags.map((tag: string, idx: number) => {
                          const isVIP = tag.toUpperCase() === 'VIP';
                          return (
                            <span 
                              key={idx} 
                              className={\`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border \${
                                isVIP 
                                  ? 'bg-amber-500/10 text-amber-600 border-amber-500/20' 
                                  : 'bg-primary/5 text-primary border-primary/10'
                              }\`}
                            >
                              {isVIP && <Star className="w-2.5 h-2.5 fill-current" />}
                              {!isVIP && <Tag className="w-2.5 h-2.5" />}
                              {tag}
                            </span>
                          );
                        })
                      ) : (
                        <span className="text-xs text-muted-foreground italic">No labels</span>
                      )}
                    </div>
                  </td>`;
code = code.replace(tagsRegex, newTagsRenderer);

fs.writeFileSync('src/app/contacts/page.tsx', code);
