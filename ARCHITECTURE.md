# OpenAnime Theme System Architecture

## 1. Genel hedef

Bu proje için ana hedefler:
- `custom css` yoluyla tema kullanımını izlemek.
- Tema üretme ve paylaşma aracını desteklemek.
- Tema yönetimi, güncelleme ve versiyonlama yapabilmek.
- OpenAnime gibi hedef siteleri analiz ederek uygun tema üretimi sağlamak.
- Aynı kullanıcıyı mümkün olduğunca tekrar saymadan saymak.

## 2. Mimarinin ana katmanları

1. **Vercel uygulaması (`vercel/`)**
   - API yönlendirmeleri, istatistik toplama ve dashboard arayüzü.
   - `api/count.js` ile CSS tetiklemelerini sayma.
   - `api/themes.js` ile tema meta verilerini yönetme.
   - `public/` altındaki arayüz ile tema listesini gösterme ve demo tema gönderme.

2. **Temalar deposu (`themes/`)**
   - Her tema için ayrı `.css` dosyası.
   - Kullanıcılar ve site sahipleri için temasal kaynak depolama.
   - İleride ayrı bir tema sürüm depolama sistemi veya bağımsız tema repo yapısına dönüştürülebilir.

3. **Kalıcı veri katmanı**
   - Başlangıçta basit bir in-memory yakalama var.
   - Gerçek kullanım için ideal: `Vercel KV`, `Supabase`, `Postgres`, `MongoDB` gibi bir veri deposu.
   - Tema meta verileri, versiyon, kullanıcı gönderimleri ve sayım kayıtları burada saklanmalı.

4. **Tema üretim aracı**
   - Temalara özel değişkenler ve CSS sonuçları üretecek bir araç.
   - Siteye özel analiz sonucu, hedef site CSS sınıfları, arka plan seçicileri ve renk uyumları çıkarmalı.
   - Bu araç, kullanıcıya temayı sürükle-bırak veya parametrelerle oluşturma imkânı verebilir.

5. **Site analizi katmanı**
   - OpenAnime gibi hedef sitelerde kullanılacak sayfaları analiz etme.
   - `bypass` header ile site içeriğini çekme ve DOM/ CSS yapısını çözümleme.
   - Analiz sonucunda hangi öğelere temayı uygulayabileceğimizi ve hangi CSS seçicilerin doğru çalışacağını belirleme.

## 3. Tavsiye edilen mimari karar

### A. Ayrık iki repo/klasör stratejisi
- `vercel/` uygulaması: API + arayüz.
- `themes/` klasörü: tema depolama.

Sebep:
- Vercel uygulaması sadece dağıtım için kullanılacak.
- Temalar ayrı tutularak GitHub üzerinden sürüm kontrolü ve tema katkı yönetimi kolaylaşır.
- İleride `themes/` klasörü ayrı bir GitHub repo olabilir.

### B. Tema yönetimi ve yayın akışı
- Her tema meta verisi `slug`, `name`, `description`, `updatedAt`, `version` içermeli.
- Tema oluşturma / güncelleme arayüzü olmalı.
- Tema güncelleme onay süreci eklenebilir: örneğin admin onayı veya otomatik test.
- Tema CSS dosyası yalnızca `themes/` klasöründe depolanmalı, arayüz metadata için API kullanmalı.

### C. Sayım ve tekilleştirme
- `api/count.js` değişiklikleri:
  - İstekleri sadece background-image kaynağı olarak değil, kabul edilen tüm tetikleyicilerle say.
  - IP + User-Agent + sec headers + referer kombinasyonuyla bir fingerprint oluştur.
  - Aynı parmak izi için `24h` veya `7d` içinde tekrar sayım engelle.
- Daha güçlü olan:
  - bir `uid` varsa URL parametresi ile gelmesi,
  - veya same-origin cookie / localStorage desteği.

### D. Tema üretim aracı
- Temel olarak bir `builder` modülü olmalı.
- Kullanıcı arayüzde girdi verebilmeli: renkler, arka plan resimleri, tipografi, gölgeler, animasyon.
- Örnek CSS şablonları ve `placeholder` seçiciler ile otomatik üretim yapılmalı.
- Üretilen CSS, `themes/` altındaki dosyalara kaydedilebilir.
- Ayrıca `export` özelliği ile doğrudan `openanime.css` gibi bir dosya oluşturup paylaşabilmeli.

### E. Site analizine yönelik plan
- Hedef site URL’ini al ve özel `bypass` header ile fetch et.
- Başlıca aday sayfaları tarayıp:
  - kullanılan CSS sınıfları,
  - inline stiller,
  - JavaScript ile dinamik yüklenen sınıflar,
  - mevcut tema destek noktalarını belirle.
- Sonra bu veriyi tema üretim aracına besle.
- Analiz sonuçları, “OpenAnime için kullanılacak seçiciler” gibi bir rapor halinde saklanabilir.

## 4. Önerilen teknoloji seçimi

- Backend: Vercel Serverless + Node.js
- Depolama: Vercel KV veya Supabase/DB
- Frontend: statik HTML/JS başlangıç, ileride React/Next.js
- Tema depolama: GitHub temek klasör veya ayrı repo
- Analiz: headless browser veya `fetch` + HTML parser

## 5. Karar yazısı

Bu yapıda en mantıklı mimari şu:
- `vercel/` uygulaması izleme ve yönetim katmanı,
- `themes/` klasörü gerçek tema kaynağı,
- API tarafında kalıcı veri deposu ile sayım ve metadata saklama,
- bir tema üreticisi aracı ile CSS çıktısı oluşturma,
- bir site analiz modülü ile OpenAnime benzeri hedefleri inceleme.

Bu karar, projenin hem hızlı deploy edilebilir hem de ileride büyütülebilir olmasını sağlar.

## 6. Hesap ve izin yapısı

### Hesap rolleri
- `admin`
  - tüm temaları yönetebilir
  - kullanıcıları ekleyebilir, yetkilerini değiştirebilir
  - tema onay/ret süreçlerini kontrol eder
- `creator` / `theme creator`
  - tema oluşturabilir
  - kendi temalarını güncelleyebilir
  - temalarını yayınlanmak üzere gönderebilir
- `user`
  - temaları görüntüleyebilir ve indirebilir
  - arama yapabilir
  - kendi favori temalarını kaydedebilir

### Güvenli kimliklendirme
- `env` değişkenleri sadece API anahtarları ve gizli bilgileri tutmalı, oturum yönetimi için kullanılmamalı.
- Hesaplar veritabanında saklanmalı:
  - `username`
  - `email`
  - `passwordHash`
  - `role` (`admin`, `creator`, `user`)
  - `createdAt`, `lastLogin`
- Basit JWT / session-based auth ile giriş yapılabilir.
- Her kullanıcı için yetki kontrolleri API ve arayüzde uygulanmalı.

### Yetki bazlı tema işlemleri
- `creator` sadece kendi temalarını düzenleyebilir.
- `admin` tüm temalar üzerinde tam kontrol sahibi olur.
- `user` sadece tema arayabilir, görüntüleyebilir ve indirebilir.
- Tema güncelleme isteği gönderildiğinde `creator` kendi temasını güncelleme yetkisine sahip olmalı.
- Temayı herkesin görebilmesi için `admin` onayı gerekebilir; bu kontrol söz konusu sistemde yer almalı.

## 7. Tema üretme aracı

### Tema yapma arayüzü
- Kullanıcılar tema adı, kısa açıklama, arka plan görseli ve ana renk paleti seçebilmeli.
- `custom background` yükleme desteği olmalı.
- Tema değişkenlerini kullanarak canlı önizleme sunulmalı.
- Tema CSS dosyası otomatik üretilmeli ve doğru yapılandırılmış bir `theme_id` içerilmeli.

### Tema meta yapısı
- Her tema şu meta verilerle saklanmalı:
  - `themeId` (benzersiz, örn. `theme_pulsar`)
  - `slug`
  - `name`
  - `description`
  - `ownerId`
  - `version`
  - `status` (`draft`, `pending`, `published`, `archived`)
  - `createdAt`, `updatedAt`
- `themeId` kaynak kodun içinde iz sürme için kullanılmalı.

### Tema oluşturma ve güncelleme
- Tema oluşturulduğunda bir `theme_id` atanır.
- Tema güncellemesi yapıldığında eski sürümler kaydedilir.
- Kullanıcı kendi tema sürümlerini görüntüleyebilir.
- `admin` veya `moderator` onay verdiğinde tema yayınlanır.

## 8. Site yapısı

### Önerilen sayfalar
- `Anasayfa`
  - öne çıkan temalar
  - yeni temalar
  - toplam kullanım istatistikleri
- `Tema Kütüphanesi`
  - arama, filtreleme, kategori
  - tema detay sayfası
- `Tema Detay Sayfası`
  - tema önizlemesi
  - `creator` bilgisi
  - indirme / kullanım talimatları
  - sürümler
- `Tema Yükle / Oluştur`
  - `creator` kullanıcılar için özel form
  - arka plan yükleme, renk paleti seçimi, açıklama ekleme
- `Hesap / Profil`
  - kullanıcı rolleri ve kendi temaları
  - yüklenen tema listesi
- `Admin Paneli`
  - temaları onaylama
  - kullanıcı rollerini yönetme
  - istatistikleri inceleme

### Özel sayfalar
- `Search`
  - tema arama ve filtreleme
  - tema adı, etiket, owner, popülerlik
- `Sürüm geçmişi`
  - her tema için eski sürümlere erişim
- `İstatistik raporu`
  - 1 hafta, 1 ay, toplam kullanıcı sayısı
  - theme-specific kullanım verileri

## 9. Tema kullanım sayımı yaklaşımı

### Sorun
- Aynı arka plan resmi farklı temalar tarafından kullanılabilir.
- Bu nedenle sadece `background-image` isteğine bakmak yanlıştır.

### Çözüm
- Tema CSS içine benzersiz bir `theme_id` ekle.
- CSS içinde kullanılan tracker URL’i şöyle olmalı:
  - `background-image: url('https://<app>/api/count?theme=theme_slug&themeId=theme_pulsar');`
- Böylece her tema ayrı ayrı tanınır, aynı resmi kullansalar bile talepler ayrı kayıt edilir.

### Hidden tracker stratejisi
- İsteği görünmez bir `background-image` veya `content: url(...)` ile ekle.
- Örnek:
  - `body::after { content: ""; position: absolute; width: 0; height: 0; background: url('https://<app>/api/count?theme=theme_slug&themeId=theme_pulsar') no-repeat; }`
- Bu istek normal bir arka plan isteği gibi çalışır ancak kullanıcıya görünmez.
- Sitenin sayfasında gizli bir `themeId` ile istek atmak, tema sahibini ayırt eder.

### Sayımın doğruluğu
- Arka plan isteği sadece bir kullanım sinyali sağlar.
- Tekilleştirme için sunucuda `themeId + fingerprint` kullan.
- `visit` kayıtlarına şu kolonlar eklenmeli:
  - `themeId`
  - `userFingerprint`
  - `requestAt`
  - `themeOwnerId`
- Böylece `1 hafta`, `1 ay`, `toplam` gibi raporlar üretebiliriz.

### İstatistik raporları
- `themeUsage` tablosu şu sorgulara izin vermeli:
  - son 7 gün içinde kaç farklı fingerprint geldi
  - son 30 gün içinde kaç farklı fingerprint geldi
  - toplam kaç benzersiz kullanım var
- `themeId` sayesinde her tema ayrı ayrı sayılır.
- `ownerId` sayesinde her yaratıcı kendi tema verilerini görür.

## 10. Örnek tema tracker yapısı

Her tema için CSS üretimi şu bölümleri içermeli:
- `:root` değişkenleri
- ana stil kuralları
- `body::after` veya `html::before` içindeki tracking URL
- `background-image` ile theme-specific tracker

### Örnek
```css
:root {
  --theme-id: "theme_pulsar";
}

body::after {
  content: "";
  position: absolute;
  width: 0;
  height: 0;
  overflow: hidden;
  background: url('https://<app>/api/count?theme=theme_slug&themeId=theme_pulsar') no-repeat;
}
```

## 11. Temaya özel sayıların güvenliği

- Temayı kullanan cihaz sayısı doğrudan `background-image` isteğine değil, `themeId` ve fingerprint kaydına dayanır.
- `themeId` farklı olduğu sürece aynı görseli kullanan farklı temalar ayrılır.
- Böylece `theme_pulsar` ile `theme_askin` aynı arkaplanı kullansa bile ayrı sayaç olur.

## 12. Sonuç

Bu yapı üç parçadan oluşmalı:
1. `Hesap & yetki` sistemi — admin/creator/user rolleri.
2. `Tema üretim aracı` — custom background, önizleme, version, theme_id üretimi.
3. `Site` — arama, tema kütüphanesi, admin paneli, istatistik raporu.

Bu mimari, tüm kullanıcıların temaları yükleyip güncellemesine, adminlerin kontrol etmesine ve tema kullanımını doğru `themeId` bazında takip etmesine izin verir.
