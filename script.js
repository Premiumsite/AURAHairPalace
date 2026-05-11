const progress = document.getElementById('progress')
const nav = document.getElementById('nav')
let lastY = window.scrollY

window.addEventListener('scroll', () => {
  const h = document.documentElement.scrollHeight - innerHeight
  progress.style.width = `${(scrollY / h) * 100}%`

  if (scrollY > lastY && scrollY > 120) nav.classList.add('hide')
  else nav.classList.remove('hide')
  lastY = scrollY
})

const reveals = document.querySelectorAll('.reveal')
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('show')
  })
}, { threshold: .14 })
reveals.forEach(el => revealObserver.observe(el))

const gallery = document.querySelector('#galeri')
const thumbs = document.querySelectorAll('.video-thumb')
const playerBox = document.querySelector('#cinemaPlayer')
const mainVideo = document.querySelector('#mainVideo')
const closeCinema = document.querySelector('#closeCinema')
const cinemaTitle = document.querySelector('#cinemaTitle')

let galleryLoaded = false

function loadVideoThumbs(){
  if(galleryLoaded) return
  galleryLoaded = true
  thumbs.forEach(btn => {
    const vid = btn.querySelector('video')
    const src = btn.dataset.src
    vid.src = src
    vid.muted = true
    vid.load()
  })
}

const galleryObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      loadVideoThumbs()
      galleryObserver.disconnect()
    }
  })
}, { rootMargin:'350px 0px' })

if(gallery) galleryObserver.observe(gallery)

thumbs.forEach((btn, index) => {
  const preview = btn.querySelector('video')

  btn.addEventListener('mouseenter', () => {
    if(preview.src) preview.play().catch(()=>{})
  })

  btn.addEventListener('mouseleave', () => {
    preview.pause()
  })

  btn.addEventListener('click', () => {
    const src = btn.dataset.src
    playerBox.hidden = false
    mainVideo.src = src
    mainVideo.muted = true
    mainVideo.volume = 0
    mainVideo.playbackRate = 1
    cinemaTitle.textContent = `galeri video ${String(index + 1).padStart(2,'0')}`
    mainVideo.play().catch(()=>{})
    playerBox.scrollIntoView({behavior:'smooth', block:'center'})
  })
})

document.querySelectorAll('[data-speed]').forEach(btn => {
  btn.addEventListener('click', () => {
    mainVideo.playbackRate = Number(btn.dataset.speed)
    mainVideo.muted = true
    mainVideo.volume = 0
  })
})

closeCinema.addEventListener('click', () => {
  mainVideo.pause()
  mainVideo.removeAttribute('src')
  mainVideo.load()
  playerBox.hidden = true
})

mainVideo.addEventListener('volumechange', () => {
  mainVideo.muted = true
  mainVideo.volume = 0
})


const lightbox = document.querySelector('#imageLightbox')
const lightboxImage = document.querySelector('#lightboxImage')
const lightboxClose = document.querySelector('#lightboxClose')

document.querySelectorAll('.photo[data-image]').forEach(photo => {
  photo.addEventListener('click', () => {
    lightboxImage.src = photo.dataset.image
    lightbox.hidden = false
    document.body.style.overflow = 'hidden'
  })
})

function closeLightbox(){
  lightbox.hidden = true
  lightboxImage.removeAttribute('src')
  document.body.style.overflow = ''
}

if(lightboxClose) lightboxClose.addEventListener('click', closeLightbox)
if(lightbox) lightbox.addEventListener('click', e => {
  if(e.target === lightbox) closeLightbox()
})

document.addEventListener('keydown', e => {
  if(e.key === 'Escape' && lightbox && !lightbox.hidden) closeLightbox()
})
