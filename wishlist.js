const getWishes = () => {
  const lwishes = window.localStorage.getItem('wishes')
  // wishes = typeof(wishes) == "string" ? JSON.parse(wishes) : wishes
  // wishes = wishes || []
  return lwishes ? JSON.parse(lwishes) : []
}

const setWishes = wishes => {
  window.localStorage.setItem('wishes', JSON.stringify(wishes))
}

const addWish = wish => {
  const wishes = getWishes()
  wishes.push(wish)
  setWishes(wishes)
}

const rmWish = wishID => {
  const wishes = getWishes()
  // for (let i = wishes.length; i--;) {
  //   if (wishes[i].id === wishID) {
  //     wishes.splice(i, 1);
  //   }
  // }
  newWishes = wishes.filter(w => w.id !== wishID)
  setWishes(newWishes)
  return newWishes
}

// ----------------------------------------------------------------------------

const show_wishlist = (e) => {
  // maybe rather like this? https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/user_interface/Extension_pages
  const modal = document.getElementById('chciroh')
  //populateWishDiv(modal)
  modal.classList.toggle('show');
}

const addWishEl = wish => {
  const ul = document.getElementById('wishUL')
  addWishElTo(wish, ul)
}

const rmWishEl = (wishID, e) => {
  const li = e.target.parentElement.parentElement
  li.parentNode.removeChild(li)
  rmWish(wishID)
}

const addWishElTo = (wish, wishUL) => {
  console.log('inside addWish', wish)
  const li = document.createElement('li')
  //li.appendChild(document.createTextNode(wish))
  li.innerHTML = `<div class="wish">
    <a class="descr" href="${wish.url}">${wish.text}</a>
    <a class="close" href="#">&times;</a>
  </div>`
  const close = li.getElementsByClassName('close')[0]
  close.addEventListener('click', e => rmWishEl(wish.id, e))
  wishUL.appendChild(li)
}

// ----------------------------------------------------------------------------

const populateWishDiv = wdiv => {
  const ul = document.createElement('ul')
  ul.setAttribute('id', 'wishUL')
  let lwishes = getWishes()
  lwishes.forEach(e => addWishElTo(e, ul))
  wdiv.appendChild(ul)
}


const inject_wishlist_modal_into_homepage = function() {
  const chef = document.getElementById('topMenuItem_39')
  const chefSpan = chef.getElementsByTagName('span')[0]
  chefSpan.textContent = 'Wishlist'  
  const chefLink = chef.getElementsByTagName('a')[0]
  if (!chefLink.wishToggle) {
    chefLink.wishToggle = true
    console.log('Adding click listener to chefLink')
    chefLink.addEventListener("click", (e) => {
      e.preventDefault()
      show_wishlist(e)})}

  const chcibox = document.getElementById('chcibox')
  if (!chcibox) {
    
    const chciroh = document.createElement("div");
    chciroh.setAttribute('id', 'chciroh')
    populateWishDiv(chciroh)

    const popup = document.createElement("div");
    popup.setAttribute('id', 'chcibox')
    popup.appendChild(chciroh)
    //popup.innerHTML = `<div id='chciroh'></div>`

    //const popupHost = document.getElementsByTagName('body')[0]
    //const popupHost = document.getElementById('__next')
    const popupHost = document.getElementById('pageFullWidth')
    popupHost.insertBefore(popup, popupHost.firstChild)}
}

// ----------------------------------------------------------------------------

const genID = (length=6) => {
  return Math.random().toString(20).substr(2, length)
}

const wishFromClick = clickInfo => {
  const info = JSON.parse(clickInfo)
  let text = info.linkText
  console.log('text before', text)
  let prefix = text.indexOf('fotk')
  console.log('  prefix start', prefix)
  if (prefix >= 0) {
    prefix = prefix + 6 // fotka/foky + space
    text   = text.substr(prefix, text.length)
    console.log('  text after', text)
  }
  const wish = {url: info.linkUrl, text: text, id: genID()}
  return wish
}

// ----------------------------------------------------------------------------



// need to also do that on page load?
// https://stackoverflow.com/questions/1983654/firefox-extension-how-to-catch-onload-event
// https://stackoverflow.com/questions/18019223/load-scripts-after-page-load-firefox-extension
console.log('here we go, rohliku!')
inject_wishlist_modal_into_homepage()

window.wishClick = jInfo => {
  const wish = wishFromClick(jInfo)
  addWish(wish)
  addWishEl(wish)
}

browser.runtime.onMessage.addListener(
  (msg, sender) => {
    if (msg === 'tabUpdateFinished') {
      console.log('tab update finished: (re)injecting wishes')
      inject_wishlist_modal_into_homepage()
      return('done')
    }
    return false
  }
)

