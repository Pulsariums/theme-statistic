# Theme File Inventory and Analysis Plan

## 1. CSS File Inventory

### Root theme folder: `R:\opeanni.me css`
- `crimson.css`
- `MY SAKURA V2 .css`
- `ytAnime(REzero) copy.css`
- `ytAnime(REzero) light and dark  copy.css`
- `ytAnime(REzero) light and dark .css`
- `ytAnime(REzero) light and dark deney alanı.css`
- `ytAnime(REzero).css` (boş olabilir veya içerik mahfaza edilmiş olabilir)
- `ytAnime(REzero, neon).css`
- `ytAnime(REzero, neon)new.css`
- `YTanimev3.css`

### Improved theme folder: `R:\opeanni.me css\seks`
- `My sakura.css`
- `REzero v10.2.css`
- `REzero v8 (youtube) - Kopya.css`
- `REzero v8.css`
- `REゼロ-V7.css`
- `Re：ゼロ.css`
- `ryo yamada.css`
- `ytAnime(REzero) light and dark  copy.css`
- `ytAnime(REzero, neon).css`
- `ytAnime(REzero, neon)new.css`
- `YTanimev3.css`

## 2. Analysis plan

### 2.1 Amaç
- Her CSS dosyasında kullanılan tema tekniklerini çıkarmak.
- Bu teknikleri ortak bir bilgi havuzuna dönüştürmek.
- `opeanani.me` sitesine özel hedef seçicileri ve override kurallarını belirlemek.
- Sonra tema üretim aracını bu teknik havuzu üzerine inşa etmek.

### 2.2 Analiz adımları

1. **Kategori oluştur**
   - `root` klasöründeki dosyalar: başlangıç / deneme temaları
   - `seks` klasöründeki dosyalar: daha gelişmiş ve stabil temalar
   - Aynı isimli veya varyant dosyalar arasında ortak/ayrışan teknikleri tespit et

2. **Teknik veri havuzu oluştur**
   - her dosyadan aşağıdaki teknikleri çıkar:
     - `:root` değişkenleri ve tema motoru biçimi
     - arka plan/görsel kullanımı
     - mod seçicileri (`html.fds-theme-dark`, `html.fds-theme-light`, sistem teması)
     - mask ve klip kaldırma teknikleri
     - logo ve başlık değiştirme yöntemleri (`::before`, `::after`)
     - `overflow: hidden` + `border-radius` problemleri
     - `!important` kullanımı ve hedef site override taktikleri
     - `@import` font yükleme ve yazı tipi kontrolü
     - hover/transitions ve görünüm efektleri
     - renk paleti düzenleri, HSL değişkenleri, transparan katmanlar

3. **Teknik klasifikasyon**
   - tema motoru
   - stilleri override etme
   - görsel & arka plan teknikleri
   - tipografi / font yüklemeleri
   - responsive ve hover efektleri
   - site özel hata düzeltmeleri

4. **Teknik havuzunu dokümante et**
   - `CSS_TECHNIQUES.md` içinde bu teknikleri bir arada tut
   - `THEME_ANALYSIS_PLAN.md` içinde yeni teknikleri ekle
   - ileride UI / builder bu tekniklerden seçim yapabilmeli

### 2.3 `opeanani.me` site analiz planı

1. `opeanani.me` sayfasını bypass header ile çekmek:
   - `User-Agent`, `Accept`, `Accept-Language`, `Referer` ve gerekirse özel `bypass` header ekle
   - HTML içeriğini al
   - site tarafından yüklenen CSS dosyalarını bul
   - JS bundle ve önemli scriptleri keşfet

2. Sayfayı parse etmek:
   - sayfadaki ana sınıfları ve tema modlarını bul
   - `html` / `body` içindeki dark/light tema işaretlerini tespit et
   - spesifik sayfa elemanlarını (`.logo`, `.playlist-card`, `.calendar-card`, `.text-block`, vb.) kaydet

3. `opeanani.me` üzerine özel tema önerileri üretmek:
   - hangi seçiciler en güvenilir? (`html.fds-theme-dark`, `.svelte-xxxxxx` vb.)
   - hangi görsel/arka plan hedefleri var?
   - hangi mask/overlay kuralları kaldırılmalı?
   - hangi yazı tipi ve renk düzenleri kullanılabilir?

4. Sonuçları tema üreticisine bağlamak:
   - analiz edilen site için bir “OpenAnime tema şablonu” üret
   - teknik havuzdan en uygun öğeleri seç
   - UI’de siteye özel seçenekler göster

### 2.4 Yeni özellik ve entegrasyon önerileri

- `OpenAnime` için hedef seçici kütüphanesi oluştur
- her temanın `meta` dosyasında hangi tekniklerin kullanıldığı yazsın
- site analizinden elde edilen hedef sınıflar `theme builder` içinde otomatik öneri olarak gösterilsin
- CSS dosyalarını analiz ederken `technique score` ver: örneğin `logo override`, `background gradient`, `theme variables`, `color palette`
- yeni özellik olarak:
  - tema kaydetme/yeniden yükleme
  - tema versiyonlama
  - tekil kullanıcı izleme için proje bazlı kullanım izleme

## 3. Hemen yapılacaklar

1. mevcut dosya listesini kullanarak `CSS_TECHNIQUES.md` ve `THEME_ANALYSIS_PLAN.md` güncelle.
2. `R:\opeanni.me css` ve `R:\opeanni.me css\seks` dosyalarını tek tek analiz etmek için bir tarama yap.
3. site analizi için bypass header ile `opeanani.me` içeriğini çek ve hedef seçicileri çıkar.
4. bu sonuçları tema üretim arayüzüne entegre et.

## 4. Tema kimlikleme ve sayım planı

- Her tema bir `themeId` içermeli.
- Tema CSS’ye yalnızca arka plan resmi değil, `themeId` taşıyan bir tracking isteği eklenmeli.
- Bu sayede aynı arka planı kullanan farklı temalar ayrı ayrı sayılabilir.
- Sunucu tarafı sayımda `themeId + fingerprint` kullanılarak 1 hafta / 1 ay / toplam raporlar üretilebilir.
