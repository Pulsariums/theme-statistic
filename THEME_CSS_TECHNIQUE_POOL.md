# Theme CSS Technique Pool

Bu belge, `R:\opeanni.me css` ve `R:\opeanni.me css\seks` klasörlerindeki mevcut tema dosyalarından çıkarılan ortak teknikleri ve tema üretiminde kullanılması gereken yapı taşlarını içerir.

## 1. Tema motoru ve değişkenler
- `:root` içinde tema değişkenleri kullanın.
- Öne çıkan değişkenler:
  - `--ana-renk`, `--vurgu-rengi`, `--parlama-rengi`
  - `--theme-dark-bg-image`, `--theme-light-bg-image`, `--theme-system-bg-image`
  - `--varsayilan-kose-yuvarlakligi`, `--ozel-kart-kose-yuvarlakligi`
  - `--ayar-kart-hover-efekti`, `--ayar-gecis-suresi-kart`, `--ayar-logo-hover-efekti`
  - `--font-logo-baslik`, `--boyut-font-logo-baslik`, `--kalinlik-font-logo-baslik`
- Değişkenleri açık bir tema motoru olarak organize edin; bu, tema üretim arayüzünün kolayca CSS oluşturmasını sağlar.

## 2. Tema modları
- Tema dosyalarında `html.fds-theme-dark`, `html.fds-theme-light` ve `html:not(.fds-theme-light):not(.fds-theme-dark)` seçicileri sık kullanılmış.
- Bu yapı, koyu, açık ve sistem (varsayılan) modları ayrıştırmak için ideal.
- Tema üreticisi bu üç modu destekleyebilmeli.

## 3. Stil override teknikleri
- Çok sayıda kural `!important` ile yazılmış.
- Bu, hedef site CSS’ini güçlü bir şekilde ezmek için gerekli ama dikkatli kullanılmalı.
- En yaygın kullanım alanları:
  - arka plan ve renk değişiklikleri
  - kenar yuvarlaklığı ve border
  - text/ikon renkleri
  - görünürlük gizleme ve logo replacement

## 4. Arka plan / görsel stratejileri
- Arka plan olarak `background-image: url(...)`, `background-size: cover`, `background-position: center center` ve `background-attachment: fixed` kullanılmış.
- Temalarda değişken tabanlı arka plan URL’leri tercih ediliyor.
- `mask-image: none` ve `overflow: hidden` kullanılarak orijinal site maskeleri ve taşan görseller kontrol ediliyor.
- Tema arayüzü, kullanıcıya `background` URL girişi veya sabit tema resimleri seçme imkânı sunmalı.

## 5. Logo / metin değiştirme yaklaşımları
- `::before` / `::after` pseudo-element’leri ile logo/metin yerleştirme kullanılıyor.
- Orijinal logo elemanları gizlenip yeni bir içerik ekleniyor.
- Bu, site logosunu ve başlık metnini tema kimliğine göre değiştirmek için ideal.

## 6. Mask / clip düzeltmeleri
- `.calendar-card`, `img`, `a` ve diğer kart bileşenlerinde `overflow: hidden !important` yaygın.
- `border-radius` veya `mask-image: none` kullanarak resim taşması ve mask problemi çözülüyor.
- Tema üretim aracı, bu tip düzeltmeleri varsayılan kural olarak sağlamalı.

## 7. Font / @import kullanımı
- Google Fonts ve özel font aileleri (`Dancing Script`, `Permanent Marker`) kullanılmış.
- Tema builder, başlık fontları ve genel font aileleri için seçim sunmalı.
- `@import url(...)` ile font yükleme desteklenmeli.

## 8. Site özel düzeltmeler
- `html.fds-theme-dark .list-item`, `.logo.svelte-1o4qk3e`, `.playlist-card`, `.calendar-card` gibi hedef seçiciler OpenAnime uyumluluğuna işaret ediyor.
- Siteye özel seçiciler, tema üretici tarafından ayrı bir şablon olarak ele alınmalı.
- Hedef seçicilerin çoğu, temanın `OpenAnime` gibi bir site için optimize edilmesini sağlıyor.

## 9. Tema kimlikleme ve tracker stratejisi
- Tema dosyalarına özel `themeId` ekleyin.
- Her tema CSS’inde tracker URL’si şu biçimde kullanılmalı:
  - `https://<app>/api/count?theme=theme_slug&themeId=theme_pulsar`
- Böylece aynı arka plan resmi kullanan farklı temalar ayrı sayılır.
- Tracker isteği gizli bir pseudo-element aracılığıyla yapılabilir.

## 10. Builder için rekomendasyonlar
- Tema üretim arayüzü şunları sunmalı:
  - renk paleti düzeni
  - tema modu seçimi (dark/light/system)
  - arka plan URL yükleme
  - logo başlığı ve yazı tipi seçimi
  - `overflow`, `border-radius` ve `mask-image` düzeltme setleri
  - `!important` kullanımı gerektiren geçerli stil override setleri
- Her temada bir değişken kümesi ve sabit `themeId` bulunmalı.
