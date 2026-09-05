const fs = require('fs');
let code = fs.readFileSync('src/app/support/page.tsx', 'utf8');

// The block to remove:
// <div className="flex flex-col gap-4"> ... down to the end of the grid.
// And change the grid wrapper.

const oldGrid = `<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Email Contact Card */}
        <a 
          href="mailto:support@whitebook.app"
          className="bg-primary text-primary-foreground border-transparent rounded-3xl p-8 shadow-sm hover:shadow-md transition-all hover:scale-[1.02] cursor-pointer group flex flex-col justify-between relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-colors"></div>
          <div>
            <Mail className="w-10 h-10 mb-6 text-white/90" />
            <h3 className="font-extrabold text-2xl mb-2">Email Support</h3>
            <p className="text-primary-foreground/80 font-medium mb-6">
              Our team typically responds within 2 hours. Send us your bugs, feature requests, or questions.
            </p>
          </div>
          <div className="flex items-center gap-2 font-bold text-sm bg-black/20 w-fit px-4 py-2 rounded-xl backdrop-blur-md">
            support@whitebook.app <ExternalLink className="w-4 h-4 ml-1 opacity-70" />
          </div>
        </a>

        {/* Resources Stack */}
        <div className="flex flex-col gap-4">
          <div 
            onClick={() => alert("Opening Documentation portal...")}
            className="flex-1 rounded-3xl border border-border/60 bg-card p-6 hover:shadow-sm transition-all cursor-pointer group flex flex-col justify-center"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Book className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Documentation</h3>
                <p className="text-sm text-muted-foreground font-medium mt-0.5">Comprehensive guides and API refs</p>
              </div>
            </div>
          </div>
          
          <div 
            onClick={() => alert("Opening Keyboard Shortcuts guide...")}
            className="flex-1 rounded-3xl border border-border/60 bg-card p-6 hover:shadow-sm transition-all cursor-pointer group flex flex-col justify-center"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Keyboard className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Keyboard Shortcuts</h3>
                <p className="text-sm text-muted-foreground font-medium mt-0.5">Navigate Whitebook like a pro</p>
              </div>
            </div>
          </div>
        </div>
      </div>`;

const newGrid = `<div className="max-w-xl mb-10">
        {/* Email Contact Card */}
        <a 
          href="mailto:support@whitebook.app"
          className="bg-primary text-primary-foreground border-transparent rounded-3xl p-8 shadow-sm hover:shadow-md transition-all hover:scale-[1.02] cursor-pointer group flex flex-col justify-between relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 -mt-4 -mr-4 w-40 h-40 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-colors"></div>
          <div>
            <Mail className="w-10 h-10 mb-6 text-white/90" />
            <h3 className="font-extrabold text-2xl mb-2">Email Support</h3>
            <p className="text-primary-foreground/80 font-medium mb-8">
              Our team typically responds within 2 hours. Send us your bugs, feature requests, or questions directly.
            </p>
          </div>
          <div className="flex items-center gap-2 font-bold text-sm bg-black/20 hover:bg-black/30 transition-colors w-fit px-5 py-2.5 rounded-xl backdrop-blur-md">
            support@whitebook.app <ExternalLink className="w-4 h-4 ml-1 opacity-70" />
          </div>
        </a>
      </div>`;

code = code.replace(oldGrid, newGrid);
fs.writeFileSync('src/app/support/page.tsx', code);
