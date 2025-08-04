(() => {
  function menu(selector = '[data-custom-nav]') {
      document.querySelectorAll(selector).forEach((nav) => {
        const trigger = nav?.querySelector('button');
        const menu = nav?.querySelector('div');

        if (!nav || !trigger || !menu) return;
        menu.remove()
  
        // Toggle class on <body> when trigger is clicked
        trigger.addEventListener('click', (e) => {
            e.stopPropagation();
            nav.classList.toggle('open');            
            document.body.classList.toggle("overflow-hidden")
            if (nav.classList.contains('open')) {
              document.body.appendChild(menu)
            } else {
              menu.remove()
            }
        });
  
        menu.addEventListener('click', (e) => {
          menu.remove();
          nav.classList.remove('open');
          document.body.classList.remove("overflow-hidden")        
        });
        
        // Prevent clicks inside menu from toggling class
        Array.from(Array.from(menu.children)[0].children).forEach((child) => {
          child.addEventListener('click', (e) => {
              e.stopPropagation();
          });
        })
  
        // Remove class when a link is clicked
        menu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                menu.remove();
                nav.classList.remove('open');
                document.body.classList.remove("overflow-hidden")
            });
        })

      })
  }

  window.menu = menu;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => menu());
  } else {
    menu();
  }
})();