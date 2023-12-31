(function(defaultDelay){
	'use strict';
	var regImg = /<img.*?>/gi
	,regIframe = /<iframe.*?>/gi
	,regSrc = /src="(.*?)"/gi
	,repImg = 'data-src="$1" src="data:image/gif;base64,R0lGODlhAQABAIAAAOvr6wAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw=="'
	,repIframe = 'data-src="$1" src="data:text/plain;charset=UTF-8,Carregando..."'
	,eventsPolyfill = [
		'transitionend',
		'animationend',
		'webkitAnimationEnd',
		'resize',
		'scroll',
	]
	,windowHeight = (window.innerHeight || document.documentumentElement.clientHeight)
	,windowWidth = (window.innerWidth || document.documentumentElement.clientWidth)
	,execLoad = null
	,mountLoad = null
	,onloadImg = function(img, delay) {
		setTimeout(function() {
			img.className = img.className.replace('lazy-loading', 'lazy-loaded')
		}, delay >>> 0)
		img.removeEventListener('onload', onloadImg)
	}
	,throttle = function(callback, limit) {
		if (execLoad !== null) clearTimeout(execLoad)
		execLoad = window.setTimeout(function() {
			callback()
			execLoad = null
		}, (limit || 550))
	}
	window.autoLazyload = {}
	window.autoLazyload.run = function(delay) {
		var lazy = document.querySelectorAll('.lazy-loading');
		var observer = new IntersectionObserver(function(entries, observer) {
			for (var z = 0, v = entries.length; z < v; z++) {
				if (entries[z].isIntersecting === false) continue
				if (entries[z].target.dataset.bg) {
					entries[z].target.style.backgroundImage
						= 'url(' + entries[z].target.dataset.bg + ')'
					onloadImg(entries[z].target, delay)
				}
				if (entries[z].target.dataset.src) {
					entries[z].target.onload = onloadImg(entries[z].target, delay)
					entries[z].target.src = entries[z].target.dataset.src
				}
				observer.unobserve(entries[z].target)
			}
		})
		for (var x = 0, c = lazy.length; x < c; x++) {
			observer.observe(lazy[x]);
		}
		observer = lazy = undefined
	}
	window.autoLazyload.mount = function(delay = null) {
		var elems = document.querySelectorAll('.has--lazyload')
		if (elems.length !== 0 || mountLoad === null) {
			mountLoad = window.setTimeout(function() {
				mountLoad = null
			}, 550)
			for (var z = 0, y = elems.length; z < y; z++) {
				var div = document.createElement('div')
				var html = elems[z].querySelector('noscript')
				var getToLazy = null
				if (html === null || html.textContent.length === 0) continue
				html = html.textContent
				if (regImg.test(html)) {
					html = html.replace(regImg, function(str) {
						return str.replace(regSrc, repImg)
					});
					div.innerHTML = html
					getToLazy = div.getElementsByTagName('img')
				}
				if (regIframe.test(html)) {
					html = html.replace(regIframe, function(str) {
						return str.replace(regSrc, repIframe)
					});
					div.innerHTML = html
					getToLazy = div.getElementsByTagName('iframe')
				}
				for (var q = 0, t = getToLazy.length; q < t; q++) 
					getToLazy[q].className += ' lazy-loading'
				elems[z].innerHTML = div.innerHTML
				elems[z].className = elems[z].className.replace('has--lazyload', '')
				html = div = getToLazy = undefined
			}
		}
		elems = undefined
		delay !== null && autoLazyload.run(delay)
	}
	if ('IntersectionObserver' in window) {
		autoLazyload.mount()
		document.addEventListener('DOMContentLoaded', function() {
			autoLazyload.run(defaultDelay)
		}, true)
	} else {
		window.autoLazyload.run = function(delay) {
			var lazy = document.querySelectorAll('.lazy-loading');
			if (lazy.length === 0) return
			for (var z = 0, v = lazy.length; z < v; z++) {
				if (lazy[z].className.indexOf('lazy-loading') === -1) continue
				var rect = lazy[z].getBoundingClientRect()
				if (
					rect.top >= 0 &&
					rect.left >= 0 &&
					rect.top <= windowHeight &&
					rect.right <= windowWidth
				) {
					if (lazy[z].dataset.bg) {
						lazy[z].style.backgroundImage = 'url(' + lazy[z].dataset.bg + ')'
						onloadImg(lazy[z], delay)
					}
					if (lazy[z].dataset.src) {
						lazy[z].onload = onloadImg(lazy[z], delay)
						lazy[z].src = lazy[z].dataset.src
					}
				}
				rect = undefined
			}
			lazy = undefined
		}
		autoLazyload.mount()
		document.addEventListener('DOMContentLoaded', function() {
			autoLazyload.run(defaultDelay)
			for(var x = 0, c = eventsPolyfill.length; x < c; x++) {
				document.addEventListener(eventsPolyfill[x], function(el) {
					if (el.target.className === undefined) return
					if (el.target.className.indexOf('has--lazyload') === -1) return
					autoLazyload.mount()
					throttle(function() {
						autoLazyload.run()
					})
				}, true)
			}
		}, true)
	}
})(0);