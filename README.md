# OpenAnime Theme System

Bu depo iki ayrı bölüm halinde tasarlandı:

- `vercel/` — Vercel'e deploy edilecek uygulama. İçinde API, arayüz ve tema yönetimi için başlangıç kodu var.
- `themes/` — gerçek CSS tema dosyalarının saklandığı yer. Bu klasör, farklı tema deposuna dönüştürülebilir.

## `vercel/` içeriği

- `vercel/api/count.js` — CSS isteğiyle gelen tema kullanımını sayar.
- `vercel/api/themes.js` — tema meta verilerini listeler ve demo amaçlı tema ekleme/güncelleme sağlar.
- `vercel/public/index.html` — basit bir arayüz: tema listesini gösterir ve yeni tema eklemeye izin verir.
- `vercel/vercel.json` — Vercel dağıtımı için yapılandırma.

## `themes/` içeriği

Bu klasörde her tema için `.css` dosyaları yer alır. Örnek:

- `themes/openanime.css`

## Nasıl kullanılır

1. `vercel/` klasörünü Vercel projesi olarak deploy edin.
2. `vercel/public/index.html` arayüzü üzerinden tema meta verilerini görebilir ve demo gönderimler yapabilirsiniz.
3. `themes/` klasöründeki CSS dosyalarını, sitenin custom CSS alanına ekleyerek kullanabilirsiniz.

## Geliştirme fikirleri

- `vercel/api/count.js` içindeki in-memory cache yerine Vercel KV / Supabase / MongoDB bağlanması.
- Tema dosyalarını `themes/` klasöründen gerçek bir tema deposuna taşıma.
- `vercel/public/` içinde kullanıcı oturumu, tema yetkilendirme ve tema yükleme arayüzü ekleme.
- `vercel/api/themes.js` üzerinde dosya veya DB tabanlı kalıcı tema yönetimi.
- OpenAnime için tema yapma rehberi ve örnek parametrelerin eklenmesi.
