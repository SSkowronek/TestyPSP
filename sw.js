// ZMIENIONA WERSJA CACHE - to wymusi na przeglądarkach pobranie nowych plików
const CACHE_NAME = 'psp-testy-v4'; 

// 1. Podstawowe pliki aplikacji (dodaj też ikony PWA!)
const CORE_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './pytania.json',
  'https://cdn.tailwindcss.com',
  './img/ikona-192.png',
  './img/ikona-512.png'
];

// 2. Lista Twoich obrazków
// Opcja A: Jeśli Twoje obrazki mają regularne nazwy, np. "img (1).png", "img (2).png" ... "img (43).png":
const IMAGE_ASSETS = Array.from({ length: 43 }, (_, i) => `./img/img (${i + 1}).png`);

// Opcja B: Jeśli mają różne nazwy, musisz je tu wpisać ręcznie w ten sposób:
// const IMAGE_ASSETS = [
//   './img/pozar.png',
//   './img/wypadek.jpg',
//   './img/znak-ewakuacyjny.png',
//   // ... i tak dalej dla wszystkich 43 plików
// ];

// Łączymy obie listy
const ASSETS = [...CORE_ASSETS, ...IMAGE_ASSETS];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cacheowanie wszystkich plików (w tym 43 obrazków)...');
        return cache.addAll(ASSETS);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Zwróć z cache jeśli istnieje, jeśli nie, pobierz z sieci
        return response || fetch(event.request).then(fetchRes => {
          return caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request.url, fetchRes.clone());
            return fetchRes;
          });
        });
      }).catch(() => {
          // Fallback offline (np. brak internetu, a zasobu nie ma w cache)
      })
  );
});

// WAŻNE: Dodajemy czyszczenie starego cache'u, aby nie zajmować miejsca na telefonie
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(keys
        .filter(key => key !== CACHE_NAME)
        .map(key => caches.delete(key))
      );
    })
  );
});