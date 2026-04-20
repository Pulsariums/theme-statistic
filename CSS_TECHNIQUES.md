# CSS Teknikleri ve Tema Tasarım Kuralları

Bu belge, `R:\opeanni.me css` ve `R:\opeanni.me css\seks` klasörlerindeki tema dosyalarından çıkarılan CSS tekniklerini toplar. Temaları geliştirirken ve tema üretim arayüzü tasarlarken bu tekniklerden faydalanabilirsin.

## 1. Tema motoru ve değişkenler
- `:root` içinde tema değişkenleri tanımlamak çok güçlü.
  - renk paleti: `--ana-renk`, `--vurgu-rengi`, `--parlama-rengi`
  - arka plan görüntüleri: `--theme-dark-bg-image`, `--theme-light-bg-image`, `--theme-system-bg-image`
  - köşe yuvarlaklığı: `--varsayilan-kose-yuvarlakligi`, `--ozel-kart-kose-yuvarlakligi`
  - efekt ayarları: `--ayar-kart-hover-efekti`, `--ayar-gecis-suresi-kart`
- Bu değişkenleri `!important` ile tutarlı hale getirmek, hedef site CSS’ini daha kolay ezmeyi sağlar.

## 2. Tema modları için seçiciler
- `html.fds-theme-dark` ile sadece karanlık temadaki stilleri hedefleyebilirsin.
- `html.fds-theme-light` ile aydınlık temaları ayır.
- `html:not(.fds-theme-light):not(.fds-theme-dark)` ile sistem teması veya varsayılan stil için özel renkler uygulayabilirsin.
- Bu yapı, birden fazla modla çalışacak temalarda tutarlılık sağlar.

## 3. Arka plan ve görsel kullanımı
- `background-image: url(...)`, `background-size: cover`, `background-position: center center`, `background-attachment: fixed` skin arkaplanları için ideal.
- Temanın temasına göre arkaplan URL’lerini değişkenlerle saklamak hem okunabilir hem de güncellenmesi kolay.
- `mask-image: none !important` ile hedef site tarafından uygulanan maske efektini kaldırabilirsin.

## 4. Kartların ve resimlerin köşe yuvarlaklığı
- `.calendar-card` gibi kartlara `overflow: hidden !important` ekleyerek içindeki resimlerin taşmasını engelle.
- `border-radius: ... !important` ile her elemanın yuvarlak köşesini kontrol et.
- Uzun el (`12px 80px 80px 80px`) border-radius ile farklı köşe formu oluşturabilirsin.

## 5. Logo ve marka özelleştirmesi
- `::before` ve `::after` ile logo alanına hem görsel hem metin yerleştirebilirsin.
- `content: url(...)` ile logo ikonu koymak ve `content: var(--tema-adi)` ile metin eklemek çok etkili.
- Bu yöntemi `display: flex` ve `align-items: center` ile destekle.

## 6. Yazı tipi ve dış kaynaklar
- `@import url(...)` ile Google Fonts veya başka fontları yükleyebilirsin.
- Örneğin `Dancing Script` veya `Permanent Marker` gibi temaya uygun başlık fontları.

## 7. Renk paleti ve HSL kullanımı
- RGB yerine `hsl()` ve `hsla()` kullanmak, tema tonlamasını dinamik hale getirir.
- Değişkenlerde `hsl(var(--ana-renk))` şeklinde tanımlamalar kullanmak iyi bir yöntem.
- `hsla(..., 0.1)` gibi şeffaf renklerle katmanlar oluşturmak nice.

## 8. Geçişler ve hover efektleri
- `transition: all 0.2s ease-in-out` gibi genel geçişler temada yumuşak animasyon sağlar.
- `transform: scale(1.1)` veya `translateY(-5px)` hover etkileri için kullan.
- Seçili menü öğelerini `box-shadow` veya `border-color` ile vurgulayabilirsin.

## 9. Hedef site CSS’ini ezme teknikleri
- `!important` kullanımı, hedef siteyi geçersiz kılmak için gereklidir ama dikkatli kullan.
- Aynı elemanın birkaç farklı kombinasyonunu birden hedeflemek, daha tutarlı sonuç verir.
  - örn: `html.fds-theme-dark .list-item.selected svg path` ve `html.fds-theme-dark .list-item:hover svg path`
- Hedef site sınıf adları değişebildiği için `:not(.fds-theme-light):not(.fds-theme-dark)` gibi fallback seçiciler iyi fikir.

## 10. Performans ve güvenlik
- Arka plan resimlerini uzaktaki URL’lerden kullanmak kolay ama performansı etkileyebilir.
- Görsellerin yüklenmemesi durumuna karşı `background-color` veya `background-size` gibi fallback’leri hazır tut.
- Harici linkleri `https://` ile kullanmak modern tarayıcı uyumluluğu için önemli.

## 11. Tema üretim arayüzü için kullanabileceğimiz teknikler
- Tema değişkenleri için bir ayar paneli oluştur: renkler, arka plan URL’leri, köşe yuvarlaklığı, shadow değerleri.
- Tema önizlemesinde `html.fds-theme-dark`, `html.fds-theme-light`, ve sistem temasını ayrı ayrı test et.
- Kullanıcıya `--tema-adi`, `--url-logo`, `--theme-dark-bg-image` gibi değişkenleri düzenlet.
- Temayı kaydederken `:root` içindeki değişkenleri çıkart ve `!important` override’ları ekle.

## 12. Dosya içeriklerinden çıkan pratik teknikler
- `.logo.svelte-1o4qk3e > *, header.mobile-topbar .homepage-nav img { display: none !important; }` — orijinal logoyu gizlemek için.
- `-webkit-mask-image: none !important; mask-image: none !important;` — maske kaldırmak için.
- `background-color: hsla(..., 0.1) !important; border-color: hsla(..., 0.8) !important;` — hover ve seçili durumlar için.
- `text-shadow: 0 0 8px hsl(...)` — vurgu metinlerine parıltı eklemek için.

## 13. `seks` klasöründeki güçlü yaklaşımlar
- `REzero v10.2.css` ve `My sakura.css` içinde: güçlü bir değişken temeli, kapsamlı mod seçicileri ve detaylı `@import` font kullanımı var.
- Bu sürümlerde hem açık hem koyu hem sistem teması için ayrı renk kümeleri tanımlanmış.
- Bu yapı, tema üretim arayüzü için örnek bir “template motoru” olarak kullanılabilir.

## Sonuç
Bu teknik listesi, tema üretim arayüzünde şu amaçlarla kullanılabilir:
- renk paleti menüsü oluşturma
- mod bazlı CSS üretme
- target site override kuralları oluşturma
- kullanıcı ayar panelinde değişken tabanlı tema kaydetme
- `overflow`, `border-radius`, `mask-image`, `content:` gibi çarpıcı stil düzeltmelerini rehber haline getirme

Bu doküman, hem `OpenAnime` tarzı temalar için hem de gelecekteki tema üretim aracında kullanılabilecek bir teknik sözlüğü olarak hizmet eder.
