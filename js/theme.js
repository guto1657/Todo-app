const themeButton = document.getElementById('themeButton')

themeButton.addEventListener('click', () => {
  document.body.classList.toggle('dark')

  if (document.body.classList.contains('dark')) {
    themeButton.src = './assets/images/icon-sun.svg'
    localStorage.setItem('theme', 'dark')
  } else {
    themeButton.src = './assets/images/icon-moon.svg'
    localStorage.setItem('theme', 'light')
  }
})

/* check what theme does the user had */

window.addEventListener('load', () => {
  let theme = localStorage.getItem("theme")

  !theme && localStorage.setItem("theme", "light")



  if (theme == 'dark') {
    document.body.classList.add('dark')
    themeButton.src = './assets/images/icon-sun.svg'
  }
})

