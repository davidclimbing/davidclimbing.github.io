interface HeaderProps {
  onToggleSidebar: () => void;
  onToggleDark: () => void;
  isDark: boolean;
}

export function Header({ onToggleSidebar, onToggleDark, isDark }: HeaderProps) {
  return (
    <header className={`vp-header fixed top-0 left-0 right-0 z-50 border-b backdrop-blur ${isDark ? 'vp-header-dark' : 'vp-header-light'}`}>
      <div className="vp-header-container h-full flex items-center justify-between px-6 lg:px-8">
        <div className="flex items-center gap-4 lg:gap-6">
          <button
            onClick={onToggleSidebar}
            className="vp-header-menu-button lg:hidden p-2 rounded-md transition-colors"
            aria-label="Toggle sidebar"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          
          <a href="/" className="flex items-center gap-2 font-semibold text-base lg:text-lg hover:opacity-80 transition-opacity">
            <span className="text-xl lg:text-2xl">📔</span>
            <span className="vp-header-logo">나의 기록</span>
          </a>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={onToggleDark}
            className="vp-toggle-dark relative inline-flex items-center h-5 w-10 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2"
            aria-label="Toggle dark mode"
            title="Toggle appearance"
          >
            <span className={`${isDark ? 'translate-x-5' : 'translate-x-0.5'} inline-block h-4 w-4 transform rounded-full bg-white shadow-lg transition-transform duration-200 flex items-center justify-center`}>
              <svg className="vp-toggle-icon w-2.5 h-2.5" fill="currentColor" viewBox="0 0 16 16">
                {isDark ? (
                  <path d="M8 2a.5.5 0 01.5.5v1a.5.5 0 01-1 0v-1A.5.5 0 018 2zM12.5 8a.5.5 0 01.5-.5h1a.5.5 0 010 1h-1a.5.5 0 01-.5-.5zM8 12a.5.5 0 01.5.5v1a.5.5 0 01-1 0v-1a.5.5 0 01.5-.5zM3.5 8a.5.5 0 01-.5.5H2a.5.5 0 010-1h1a.5.5 0 01.5.5zm7.646-5.146a.5.5 0 010 .707l-.707.707a.5.5 0 11-.707-.707l.707-.707a.5.5 0 01.707 0zM4.561 11.439a.5.5 0 010 .707l-.707.707a.5.5 0 11-.707-.707l.707-.707a.5.5 0 01.707 0zM12.854 11.439a.5.5 0 00-.707 0l-.707.707a.5.5 0 00.707.707l.707-.707a.5.5 0 000-.707zM3.146 4.561a.5.5 0 00.707 0l.707-.707a.5.5 0 00-.707-.707l-.707.707a.5.5 0 000 .707zM8 5.5a2.5 2.5 0 100 5 2.5 2.5 0 000-5z" />
                ) : (
                  <path d="M6 .278a.768.768 0 01.08.858 7.208 7.208 0 00-.878 3.46c0 4.021 3.278 7.277 7.318 7.277.527 0 1.04-.055 1.533-.16a.787.787 0 01.81.316.733.733 0 01-.031.893A8.349 8.349 0 018.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.752.752 0 016 .278z" />
                )}
              </svg>
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
