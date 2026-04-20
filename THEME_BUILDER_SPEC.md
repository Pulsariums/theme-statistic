# Theme Builder Specification

Bu belge, tema yapma aracının nasıl çalışması gerektiğini açıklar.

## 1. Model

### Tema meta verisi
Her tema şu bilgileri içermeli:
- `themeId` (örneğin `theme_pulsar`)
- `slug` (URL için kısa isim)
- `name`
- `description`
- `ownerId`
- `version`
- `status` (`draft`, `pending`, `published`, `archived`)
- `createdAt`
- `updatedAt`
- `themeMode` (`dark`, `light`, `system` veya `mixed`)
- `css` (oluşturulmuş CSS içeriği)

### Tema CSS yapısı
Oluşturulmuş CSS dosyası şu blokları içermeli:
1. `:root` değişkenleri
2. tema modu seçicileri
3. stil override kuralları
4. logo/metin değiştirme
5. gizli tracker isteği

## 2. Arayüz öğeleri

### Tema oluşturma ekranı
- Tema adı
- Tema slug
- Tema açıklaması
- Ana renk seçimi
- Vurgu rengi / parıltı rengi
- Arka plan görsel URL’si
- Logo metni
- Logo fontu seçimi
- Kart köşe yuvarlaklıkları
- Hover / geçiş süresi ayarları
- Tema modları: `dark`, `light`, `system`

### Tema önizleme
- Canlı bir önizleme alanı
- Mod seçimine göre preview değişmeli
- Tema değişkenleri güncellendikçe CSS üretimi gerçek zamanda yapılmalı

### Tema yayınlama
- `creator` temayı kaydedebilir ve `pending` duruma gönderebilir
- `admin` temayı onaylayabilir ve `published` yapabilir
- Güncellemeler `version` numarasıyla saklanmalı

## 3. Tema üretim kuralları

### Değişken tabanlı şablon
Temayı oluştururken değişkenler şöyle kullanılmalı:
```css
:root {
  --theme-id: "theme_pulsar";
  --theme-name: "Pulsar";
  --theme-color-primary: 330, 80%, 75%;
  --theme-color-accent: 330, 80%, 65%;
  --theme-bg-dark: url('...');
  --theme-bg-light: url('...');
}
```

### Tema modları
```css
html.fds-theme-dark {
  --fds-text-primary: hsl(var(--theme-color-accent));
  --fds-card-background-default: hsla(var(--theme-bg-color), 0.75);
}
html.fds-theme-light {
  --fds-text-primary: #111;
  --fds-card-background-default: hsla(0, 0%, 100%, 0.75);
}
html:not(.fds-theme-light):not(.fds-theme-dark) {
  --fds-text-primary: hsl(var(--theme-color-primary));
}
```

### Tracker ekleme
Her tema için bir arka plan tracker kuralı olmalı:
```css
body::after {
  content: "";
  position: absolute;
  width: 0;
  height: 0;
  overflow: hidden;
  background: url('https://<app>/api/count?theme=theme_slug&themeId=theme_pulsar') no-repeat;
}
```

## 4. Site analiz entegrasyonu

### OpenAnime özel şablon önerileri
- `html.fds-theme-dark` ve `html.fds-theme-light` modlarını desteklemeli
- `logo.svelte-1o4qk3e` gibi hedef seçicileri kullanmalı
- `calendar-card`, `playlist-card`, `.text-block` gibi site öğelerine özel override sağlamalı
- `mask-image` ve `overflow:hidden` düzeltmelerini otomatik olarak eklemeli

### Tema teknik havuzu
- `THEME_CSS_TECHNIQUE_POOL.md` üzerinden tema üreticinin kullanacağı durumları tanımla
- `OpenAnime` için özel bir şablon seti oluştur
- Kullanıcılar özel background yüklediğinde bu şablon otomatik uygulanmalı

## 5. Tema yükleme ve yönetim

### Tema yükleme akışı
- `creator` tema bilgilerini girer
- Temaya ait CSS oluşturulur
- `themeId` ve tracker URL otomatik eklenir
- Temayı belirli bir proje ile ilişkilendirir
- Proje metadata ve thumbnail dahil edilir
- Proje plugin kontrolleri otomatik çalışır
- Temayı kaydettiğinde `draft` olur
- `admin` onayladıktan sonra `published` hale gelir

### Güncelleme akışı
- `creator` kendi temasını günceller
- Yeni bir `version` oluşturulur
- Eski sürümlere geri dönme mümkün olmalı

## 6. Notlar
- `themeId` aynı arka plan kullanan farklı temaları ayırt etmek için zorunlu.
- Tracker isteği siteye özel görsel sayımı değil, tema kimliği bazlı talep sayımı sağlar.
- Builder aracında stil override ve mask düzeltme kalıpları hazır olmalı.
