# BundaCare - Native Android App (Kotlin & Jetpack Compose)

Aplikasi Android Native resmi untuk **BundaCare** (Pendamping Kehamilan Bunda), dibangun menggunakan **Kotlin**, **Android SDK (API 34)**, dan **Jetpack Compose (Material 3)**.

---

## 🛠️ Spesifikasi Proyek

- **Bahasa**: Kotlin 1.9.23
- **UI Toolkit**: Jetpack Compose BOM 2024.04.00 (Material 3)
- **Min SDK**: Android 8.0 (API 26)
- **Target / Compile SDK**: Android 14 (API 34)
- **Build System**: Gradle Kotlin DSL (`build.gradle.kts`)
- **Package**: `com.bundacare.app`

---

## 📁 Struktur Direktori

```
android/
├── settings.gradle.kts          # Konfigurasi repositori dan modul
├── build.gradle.kts             # Top-level plugin & dependencies
├── README.md                    # Panduan build & deployment
└── app/
    ├── build.gradle.kts         # Dependensi Android, Compose & SDK
    └── src/
        └── main/
            ├── AndroidManifest.xml
            ├── res/values/
            │   ├── strings.xml
            │   └── themes.xml
            └── java/com/bundacare/app/
                ├── MainActivity.kt               # Entry point activity
                ├── model/
                │   └── PregnancyCalculator.kt    # Kalkulator Naegele & Smart Filter
                └── ui/
                    ├── theme/
                    │   ├── Color.kt              # Palet warna BundaCare Pink
                    │   └── Theme.kt              # Material 3 Compose Theme
                    └── screens/
                        └── DashboardScreen.kt    # Layar utama interaktif
```

---

## 🚀 Cara Membuka & Build di Android Studio

1. Buka **Android Studio** (Koala / Iguana / Jellyfish atau versi terbaru).
2. Pilih **File** -> **Open...** dan arahkan ke folder `android/`.
3. Tunggu hingga Gradle Sync selesai mendownload dependensi Jetpack Compose.
4. Pilih target perangkat:
   - **Android Emulator** (Pixel 8 / Galaxy S24 dengan Android 14), atau
   - **Perangkat Fisik HP Android** via USB Debugging.
5. Klik tombol **Run (Shift + F10)** atau klik ikon segitiga hijau.

---

## 📦 Cara Generate APK atau AAB (Play Store)

1. Di Android Studio, klik menu **Build** -> **Build Bundle(s) / APK(s)** -> **Build APK(s)**.
2. File APK installer akan terbuat di:
   `app/build/outputs/apk/debug/app-debug.apk`
3. File ini dapat langsung di-install di smartphone Android Bunda manapun!
