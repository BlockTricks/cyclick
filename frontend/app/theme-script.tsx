export function ThemeScript() {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `
          (function() {
            const stored = localStorage.getItem('cyclick-theme');
            const theme = (stored === 'light' || stored === 'dark') ? stored : 'light';
            const root = document.documentElement;
            root.classList.remove('light', 'dark');
            root.classList.add(theme);
          })();
        `,
      }}
    />
  )
}

