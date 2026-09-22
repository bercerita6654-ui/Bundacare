package com.bundacare.app.model

import java.time.LocalDate
import java.time.format.DateTimeFormatter
import java.time.temporal.ChronoUnit
import java.util.Locale

data class PregnancyState(
    val hphtDate: LocalDate,
    val currentDate: LocalDate = LocalDate.now(),
    val totalDays: Long = 0,
    val gestationalWeeks: Int = 0,
    val gestationalDaysRemainder: Int = 0,
    val gestationalMonths: Double = 0.0,
    val estimatedDueDate: LocalDate = hphtDate.plusDays(280),
    val conceptionDate: LocalDate = hphtDate.plusDays(14),
    val trimester: Int = 1,
    val progressPercent: Float = 0f,
    val remainingDays: Long = 0,
    val babySizeTitle: String = "",
    val babySizeDesc: String = "",
    val maturityBadge: String = "",
    val maturityDesc: String = ""
)

data class SmartFilterResult(
    val targetDate: LocalDate,
    val targetWeeks: Int,
    val targetDaysRemainder: Int,
    val targetTrimester: Int,
    val diffFromHphtDays: Long,
    val diffFromTodayDays: Long,
    val progressPercent: Float,
    val babySizeTitle: String,
    val babySizeDesc: String,
    val medicalTitle: String,
    val medicalAdvice: String
)

object PregnancyCalculator {

    private val formatter = DateTimeFormatter.ofPattern("d MMMM yyyy", Locale("id", "ID"))

    fun calculate(hpht: LocalDate, today: LocalDate = LocalDate.now()): PregnancyState {
        val totalDays = ChronoUnit.DAYS.between(hpht, today)
        val clampedDays = totalDays.coerceAtLeast(0)
        val weeks = (clampedDays / 7).toInt()
        val daysRem = (clampedDays % 7).toInt()
        val months = (clampedDays / 30.4167)
        val edd = hpht.plusDays(280)
        val conception = hpht.plusDays(14)
        val remainingDays = ChronoUnit.DAYS.between(today, edd).coerceAtLeast(0)
        val progress = (clampedDays.toFloat() / 280f * 100f).coerceIn(0f, 100f)

        val tri = when {
            weeks < 13 -> 1
            weeks < 28 -> 2
            else -> 3
        }

        val (maturityBadge, maturityDesc) = when {
            weeks < 37 -> Pair("Preterm (Prematur)", "Kelahiran sebelum minggu ke-37. Paru-paru janin masih dalam tahap pematangan akhir.")
            weeks in 37..38 -> Pair("Early Term", "Bayi sudah cukup bulan awal (37-38 minggu).")
            weeks in 39..40 -> Pair("Full Term", "Waktu kelahiran paling ideal (39-40 minggu) dengan perkembangan organ optimal.")
            weeks == 41 -> Pair("Late Term", "Memasuki minggu ke-41, memerlukan pemantauan ketat dari dokter spesialis.")
            else -> Pair("Post-term", "Lewat bulan (>42 minggu). Konsultasikan induksi atau penanganan medis segera.")
        }

        val babyInfo = getBabySizeForWeek(weeks)

        return PregnancyState(
            hphtDate = hpht,
            currentDate = today,
            totalDays = clampedDays,
            gestationalWeeks = weeks,
            gestationalDaysRemainder = daysRem,
            gestationalMonths = months,
            estimatedDueDate = edd,
            conceptionDate = conception,
            trimester = tri,
            progressPercent = progress,
            remainingDays = remainingDays,
            babySizeTitle = babyInfo.first,
            babySizeDesc = babyInfo.second,
            maturityBadge = maturityBadge,
            maturityDesc = maturityDesc
        )
    }

    fun calculateSmartTargetDate(hpht: LocalDate, targetDate: LocalDate, today: LocalDate = LocalDate.now()): SmartFilterResult {
        val diffFromHphtDays = ChronoUnit.DAYS.between(hpht, targetDate)
        val diffFromTodayDays = ChronoUnit.DAYS.between(today, targetDate)
        val clampedDays = diffFromHphtDays.coerceAtLeast(0)
        val weeks = (clampedDays / 7).toInt()
        val daysRem = (clampedDays % 7).toInt()
        val progress = (clampedDays.toFloat() / 280f * 100f).coerceIn(0f, 100f)

        val tri = when {
            weeks < 13 -> 1
            weeks < 28 -> 2
            else -> 3
        }

        val babyInfo = getBabySizeForWeek(weeks)
        val advice = getMedicalAdviceForWeek(weeks)

        return SmartFilterResult(
            targetDate = targetDate,
            targetWeeks = weeks,
            targetDaysRemainder = daysRem,
            targetTrimester = tri,
            diffFromHphtDays = diffFromHphtDays,
            diffFromTodayDays = diffFromTodayDays,
            progressPercent = progress,
            babySizeTitle = babyInfo.first,
            babySizeDesc = babyInfo.second,
            medicalTitle = advice.first,
            medicalAdvice = advice.second
        )
    }

    fun getBabySizeForWeek(week: Int): Pair<String, String> {
        val safeWeek = week.coerceIn(4, 40)
        return when (safeWeek) {
            4 -> Pair("Biji Poppy", "Janin sedang menempel pada dinding rahim. Pembentukan tabung saraf dimulai.")
            5 -> Pair("Biji Apel", "Jantung bayi mulai berdetak! Tabung saraf mulai menutup.")
            6 -> Pair("Kacang Polong", "Cikal bakal hidung, mulut, dan telinga mulai terbentuk.")
            7 -> Pair("Blueberry", "Kepala bayi lebih besar dibanding tubuhnya. Tunas lengan dan kaki mulai tumbuh.")
            8 -> Pair("Raspberry", "Bibir atas dan hidung terbentuk. Jantung berdetak 150-170 bpm.")
            9 -> Pair("Buah Zaitun", "Mata bayi telah terbentuk, otot mulai merespons pergerakan kecil.")
            10 -> Pair("Stroberi", "Tulang rawan mulai terbentuk menjadi tulang keras. Ginjal memproduksi urine.")
            11 -> Pair("Jeruk Nipis", "Bayi mulai mengepalkan tangan dan jari kaki sudah terpisah dari selaputnya.")
            12 -> Pair("Buah Plum", "Organ utama sudah terbentuk lengkap. Refleks mengisap mulai muncul.")
            13 -> Pair("Lemon", "Bayi mulai bergerak perlahan meskipun Bunda belum bisa merasakannya.")
            14 -> Pair("Buah Persik", "Bayi mulai melatih otot wajahnya dengan mengerutkan kening.")
            15 -> Pair("Apel", "Bayi dapat merasakan cahaya dari luar rahim. Kulit masih sangat tipis.")
            16 -> Pair("Alpukat", "Sistem peredaran darah dan saluran kemih mulai berfungsi sepenuhnya.")
            17 -> Pair("Bawang Bombay", "Tulang bayi menyerap kalsium untuk semakin kuat. Bayi merespons suara.")
            18 -> Pair("Ubi Jalar", "Telinga sudah berada di posisi yang sempurna. Tali pusar semakin tebal.")
            19 -> Pair("Mangga", "Vernix caseosa mulai menyelimuti kulit bayi untuk melindunginya.")
            20 -> Pair("Pisang", "Bunda mungkin merasakan tendangan lembut (quickening). Bayi mulai menelan ketuban.")
            21 -> Pair("Wortel", "Alis dan kelopak mata bayi terbentuk penuh. Sumsum tulang memproduksi darah.")
            22 -> Pair("Pepaya Kecil", "Indera perasa berkembang, bayi bisa mengecap rasa dari cairan ketuban.")
            23 -> Pair("Terong Besar", "Paru-paru bayi mulai memproduksi surfaktan untuk persiapan bernapas.")
            24 -> Pair("Jagung", "Otak bayi berkembang pesat. Bayi mengatur posisi yang nyaman.")
            25 -> Pair("Kembang Kol", "Bayi mulai bertumbuh menjadi gempal (lemak mulai terkumpul).")
            26 -> Pair("Timun Jepang", "Mata bayi merespons kedipan. Denyut jantung mulai stabil.")
            27 -> Pair("Kubis Hijau", "Pola tidur dan bangun bayi mulai makin teratur dan panjang.")
            28 -> Pair("Terong Ungu", "Bulu halus (lanugo) yang menutupi kulit bayi perlahan mulai rontok.")
            29 -> Pair("Labu Acorn", "Otonomi tubuh makin baik mengatur suhu tubuh.")
            30 -> Pair("Kubis Besar", "Kuku bayi sudah terbentuk sempurna di jari tangan dan kaki.")
            31 -> Pair("Kelapa", "Bayi menyerap zat besi, kalsium, dan fosfor dari Bunda untuk perkuatan akhir.")
            32 -> Pair("Bengkuang", "Sebagian besar kerangka janin mengeras, tulang kepala tetap lentur.")
            33 -> Pair("Nanas Besar", "Volume cairan ketuban berada pada batas tertingginya.")
            34 -> Pair("Melon Blewah", "Antibodi Bunda ditransfer ke bayi untuk kekebalan awal pasca lahir.")
            35 -> Pair("Buah Melon", "Ginjal dan organ hati bayi sudah matang sepenuhnya.")
            36 -> Pair("Sawi Panjang", "Kepala bayi mulai turun ke rongga panggul Bunda (engaging).")
            37 -> Pair("Semangka Kecil", "Paru-paru bayi kini sudah matang. Bayi melatih pola bernapas.")
            38 -> Pair("Labu Winter", "Refleks genggaman tangan bayi semakin kuat.")
            39 -> Pair("Nangka Kecil", "Lapisan lemak tebal siap menjaga panas tubuh bayi saat lahir.")
            else -> Pair("Buah Labu", "Bayi sudah cukup bulan penuh! Selamat menanti kehadiran si buah hati.")
        }
    }

    fun getMedicalAdviceForWeek(week: Int): Pair<String, String> {
        return when {
            week <= 12 -> Pair(
                "Trimester 1: USG Awal & Skrining",
                "Fokus konsumsi asam folat 400 mcg, lakukan tes lab dasar (Hb, golongan darah), dan USG CRL pertama untuk konfirmasi usia kehamilan akurat."
            )
            week in 13..27 -> Pair(
                "Trimester 2: USG Morfologi & Anomali",
                "USG detail anatomi janin pada minggu ke 18-22, pantau kenaikan berat badan, serta konsumsi tablet zat besi dan kalsium."
            )
            week in 28..36 -> Pair(
                "Trimester 3: Evaluasi Letak & Pertumbuhan",
                "Rutin hitung gerakan janin (minimal 10 kali dalam 2 jam), cek tekanan darah, dan periksa posisi kepala janin apakah sudah di bawah."
            )
            else -> Pair(
                "Siaga Persalinan & Pantau Kontraksi",
                "Siapkan tas bersalin (Hospital Bag), ketahui tanda kontraksi asli (teratur tiap 5 menit), dan segera ke faskes jika ketuban merembes."
            )
        }
    }
}
