package com.bundacare.app.ui.screens

import android.app.DatePickerDialog
import androidx.compose.animation.AnimatedVisibility
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.hapticfeedback.HapticFeedbackType
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.platform.LocalHapticFeedback
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.bundacare.app.model.PregnancyCalculator
import com.bundacare.app.model.PregnancyState
import com.bundacare.app.model.SmartFilterResult
import com.bundacare.app.ui.theme.*
import java.time.LocalDate
import java.time.format.DateTimeFormatter
import java.util.Locale

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun DashboardScreen() {
    val context = LocalContext.current
    val haptic = LocalHapticFeedback.current

    // State
    var hphtDate by remember { mutableStateOf(LocalDate.now().minusWeeks(14)) }
    var pregnancyState by remember { mutableStateOf(PregnancyCalculator.calculate(hphtDate)) }
    var kickCount by remember { mutableIntStateOf(0) }
    var vitaminTaken by remember { mutableStateOf(false) }

    // Smart Date Filter State
    var targetDate by remember { mutableStateOf(LocalDate.of(2026, 9, 2)) }
    var smartResult by remember { mutableStateOf<SmartFilterResult?>(PregnancyCalculator.calculateSmartTargetDate(hphtDate, targetDate)) }
    var showSmartCard by remember { mutableStateOf(true) }

    val dateFormatter = DateTimeFormatter.ofPattern("d MMMM yyyy", Locale("id", "ID"))

    // HPHT Date Picker
    val hphtDatePicker = DatePickerDialog(
        context,
        { _, year, month, dayOfMonth ->
            hphtDate = LocalDate.of(year, month + 1, dayOfMonth)
            pregnancyState = PregnancyCalculator.calculate(hphtDate)
            smartResult = PregnancyCalculator.calculateSmartTargetDate(hphtDate, targetDate)
            haptic.performHapticFeedback(HapticFeedbackType.LongPress)
        },
        hphtDate.year,
        hphtDate.monthValue - 1,
        hphtDate.dayOfMonth
    )

    // Target Date Picker (Smart Filter)
    val targetDatePicker = DatePickerDialog(
        context,
        { _, year, month, dayOfMonth ->
            targetDate = LocalDate.of(year, month + 1, dayOfMonth)
            smartResult = PregnancyCalculator.calculateSmartTargetDate(hphtDate, targetDate)
            haptic.performHapticFeedback(HapticFeedbackType.LongPress)
        },
        targetDate.year,
        targetDate.monthValue - 1,
        targetDate.dayOfMonth
    )

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Box(
                            modifier = Modifier
                                .size(36.dp)
                                .clip(RoundedCornerShape(12.dp))
                                .background(Pink40),
                            contentAlignment = Alignment.Center
                        ) {
                            Icon(
                                Icons.Default.Favorite,
                                contentDescription = null,
                                tint = Color.White,
                                modifier = Modifier.size(20.dp)
                            )
                        }
                        Spacer(modifier = Modifier.width(10.dp))
                        Column {
                            Text(
                                "BundaCare",
                                fontWeight = FontWeight.Bold,
                                fontSize = 18.sp,
                                color = SlateDark
                            )
                            Text(
                                "Pendamping Kehamilan Android Native",
                                fontSize = 10.sp,
                                color = Pink40,
                                fontWeight = FontWeight.SemiBold
                            )
                        }
                    }
                },
                actions = {
                    IconButton(onClick = {
                        haptic.performHapticFeedback(HapticFeedbackType.LongPress)
                        hphtDatePicker.show()
                    }) {
                        Icon(Icons.Default.DateRange, contentDescription = "Pilih HPHT", tint = Pink40)
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(containerColor = Color.Transparent)
            )
        }
    ) { paddingValues ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
                .padding(horizontal = 16.dp)
                .verticalScroll(rememberScrollState()),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            // Hero Card: Usia Kehamilan
            Card(
                shape = RoundedCornerShape(32.dp),
                colors = CardDefaults.cardColors(containerColor = Color.White),
                elevation = CardDefaults.cardElevation(defaultElevation = 2.dp),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(
                    modifier = Modifier.padding(24.dp),
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {
                    Text(
                        "USIA KEHAMILAN SAAT INI",
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Bold,
                        color = Pink40,
                        letterSpacing = 1.sp
                    )
                    Spacer(modifier = Modifier.height(8.dp))
                    Text(
                        "${pregnancyState.gestationalWeeks} Minggu ${pregnancyState.gestationalDaysRemainder} Hari",
                        fontSize = 32.sp,
                        fontWeight = FontWeight.Black,
                        color = SlateDark,
                        textAlign = TextAlign.Center
                    )
                    Text(
                        "Trimester ${pregnancyState.trimester} • Cukup Bulan: ${pregnancyState.estimatedDueDate.format(dateFormatter)}",
                        fontSize = 12.sp,
                        color = SlateMuted,
                        modifier = Modifier.padding(top = 4.dp)
                    )

                    Spacer(modifier = Modifier.height(16.dp))
                    // Progress Bar
                    LinearProgressIndicator(
                        progress = { pregnancyState.progressPercent / 100f },
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(10.dp)
                            .clip(RoundedCornerShape(5.dp)),
                        color = Pink40,
                        trackColor = PinkLight,
                    )
                    Spacer(modifier = Modifier.height(6.dp))
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Text("Mulai (HPHT)", fontSize = 10.sp, color = SlateMuted)
                        Text("${pregnancyState.progressPercent.toInt()}% Selesai", fontSize = 10.sp, fontWeight = FontWeight.Bold, color = PinkDark)
                        Text("HPL (40 Mgg)", fontSize = 10.sp, color = SlateMuted)
                    }

                    Spacer(modifier = Modifier.height(16.dp))
                    // HPHT change chip
                    AssistChip(
                        onClick = { hphtDatePicker.show() },
                        label = { Text("HPHT: ${pregnancyState.hphtDate.format(dateFormatter)}") },
                        leadingIcon = { Icon(Icons.Default.EditCalendar, contentDescription = null, Modifier.size(16.dp)) },
                        colors = AssistChipDefaults.assistChipColors(containerColor = PinkLight)
                    )
                }
            }

            // Baby Size Card
            Card(
                shape = RoundedCornerShape(24.dp),
                colors = CardDefaults.cardColors(containerColor = Color.White),
                elevation = CardDefaults.cardElevation(defaultElevation = 2.dp),
                modifier = Modifier.fillMaxWidth()
            ) {
                Row(
                    modifier = Modifier.padding(16.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Box(
                        modifier = Modifier
                            .size(54.dp)
                            .clip(RoundedCornerShape(16.dp))
                            .background(Brush.linearGradient(listOf(Pink40, PinkDark))),
                        contentAlignment = Alignment.Center
                    ) {
                        Icon(Icons.Default.ChildCare, contentDescription = null, tint = Color.White, modifier = Modifier.size(30.dp))
                    }
                    Spacer(modifier = Modifier.width(16.dp))
                    Column(modifier = Modifier.weight(1f)) {
                        Text("Perkiraan Ukuran Janin", fontSize = 11.sp, color = Pink40, fontWeight = FontWeight.Bold)
                        Text(pregnancyState.babySizeTitle, fontSize = 16.sp, fontWeight = FontWeight.Bold, color = SlateDark)
                        Text(pregnancyState.babySizeDesc, fontSize = 11.sp, color = SlateMuted, lineHeight = 14.sp)
                    }
                }
            }

            // SMART FILTER CARD: Simulasi Tanggal Pilihan
            Card(
                shape = RoundedCornerShape(28.dp),
                colors = CardDefaults.cardColors(containerColor = Color.White),
                elevation = CardDefaults.cardElevation(defaultElevation = 3.dp),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(modifier = Modifier.padding(20.dp)) {
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.SpaceBetween,
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Icon(Icons.Default.AutoAwesome, contentDescription = null, tint = Pink40, modifier = Modifier.size(20.dp))
                            Spacer(modifier = Modifier.width(8.dp))
                            Text("Filter Pintar Tanggal", fontWeight = FontWeight.Bold, fontSize = 15.sp, color = SlateDark)
                        }
                        IconButton(onClick = { showSmartCard = !showSmartCard }) {
                            Icon(if (showSmartCard) Icons.Default.ExpandLess else Icons.Default.ExpandMore, contentDescription = null)
                        }
                    }

                    Text(
                        "Cek usia janin pada tanggal masa depan (misal: 2 September 2026)",
                        fontSize = 11.sp,
                        color = SlateMuted
                    )

                    AnimatedVisibility(visible = showSmartCard) {
                        Column(modifier = Modifier.padding(top = 12.dp), verticalArrangement = Arrangement.spacedBy(10.dp)) {
                            // Target Date Picker Button
                            OutlinedButton(
                                onClick = {
                                    haptic.performHapticFeedback(HapticFeedbackType.LongPress)
                                    targetDatePicker.show()
                                },
                                modifier = Modifier.fillMaxWidth(),
                                shape = RoundedCornerShape(16.dp)
                            ) {
                                Icon(Icons.Default.CalendarMonth, contentDescription = null, tint = Pink40)
                                Spacer(modifier = Modifier.width(8.dp))
                                Text("Pilih Tanggal: ${targetDate.format(dateFormatter)}", fontWeight = FontWeight.SemiBold)
                            }

                            // Smart Calculation Results
                            smartResult?.let { res ->
                                Box(
                                    modifier = Modifier
                                        .fillMaxWidth()
                                        .clip(RoundedCornerShape(20.dp))
                                        .background(PinkLight)
                                        .padding(14.dp)
                                ) {
                                    Column(verticalArrangement = Arrangement.spacedBy(6.dp)) {
                                        Text(
                                            "Estimasi pada ${res.targetDate.format(dateFormatter)}:",
                                            fontSize = 11.sp,
                                            fontWeight = FontWeight.Bold,
                                            color = PinkDark
                                        )
                                        Text(
                                            "${res.targetWeeks} Minggu ${res.targetDaysRemainder} Hari",
                                            fontSize = 20.sp,
                                            fontWeight = FontWeight.Black,
                                            color = SlateDark
                                        )
                                        Text(
                                            "Ukuran Janin: ${res.babySizeTitle} • Trimester ${res.targetTrimester}",
                                            fontSize = 12.sp,
                                            fontWeight = FontWeight.SemiBold,
                                            color = SlateDark
                                        )
                                        Text(
                                            res.babySizeDesc,
                                            fontSize = 11.sp,
                                            color = SlateMuted
                                        )
                                        Divider(modifier = Modifier.padding(vertical = 4.dp), color = Pink80.copy(alpha = 0.4f))
                                        Text(
                                            "Agenda Medis: ${res.medicalTitle}",
                                            fontSize = 11.sp,
                                            fontWeight = FontWeight.Bold,
                                            color = Pink40
                                        )
                                        Text(
                                            res.medicalAdvice,
                                            fontSize = 10.sp,
                                            color = SlateMuted
                                        )
                                    }
                                }
                            }
                        }
                    }
                }
            }

            // Kick Counter Section with Native Android Haptics
            Card(
                shape = RoundedCornerShape(24.dp),
                colors = CardDefaults.cardColors(containerColor = Color.White),
                elevation = CardDefaults.cardElevation(defaultElevation = 2.dp),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(modifier = Modifier.padding(20.dp), horizontalAlignment = Alignment.CenterHorizontally) {
                    Text("PENGHITUNG GERAKAN JANIN", fontSize = 11.sp, fontWeight = FontWeight.Bold, color = Pink40)
                    Spacer(modifier = Modifier.height(12.dp))
                    Text("$kickCount", fontSize = 44.sp, fontWeight = FontWeight.Black, color = SlateDark)
                    Text("Target: 10 gerakan dalam 2 jam", fontSize = 11.sp, color = SlateMuted)
                    Spacer(modifier = Modifier.height(14.dp))

                    Row(horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                        Button(
                            onClick = {
                                kickCount++
                                haptic.performHapticFeedback(HapticFeedbackType.LongPress)
                            },
                            shape = RoundedCornerShape(16.dp),
                            colors = ButtonDefaults.buttonColors(containerColor = Pink40)
                        ) {
                            Icon(Icons.Default.TouchApp, contentDescription = null)
                            Spacer(modifier = Modifier.width(6.dp))
                            Text("Catat Gerakan (+1)", fontWeight = FontWeight.Bold)
                        }

                        OutlinedButton(
                            onClick = {
                                kickCount = 0
                                haptic.performHapticFeedback(HapticFeedbackType.LongPress)
                            },
                            shape = RoundedCornerShape(16.dp)
                        ) {
                            Text("Reset")
                        }
                    }
                }
            }

            // Daily Vitamin Reminder
            Card(
                shape = RoundedCornerShape(24.dp),
                colors = CardDefaults.cardColors(containerColor = Color.White),
                elevation = CardDefaults.cardElevation(defaultElevation = 2.dp),
                modifier = Modifier.fillMaxWidth()
            ) {
                Row(
                    modifier = Modifier.padding(16.dp),
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Box(
                            modifier = Modifier
                                .size(44.dp)
                                .clip(CircleShape)
                                .background(if (vitaminTaken) EmeraldGreen else PinkLight),
                            contentAlignment = Alignment.Center
                        ) {
                            Icon(
                                if (vitaminTaken) Icons.Default.Check else Icons.Default.Medication,
                                contentDescription = null,
                                tint = if (vitaminTaken) Color.White else Pink40
                            )
                        }
                        Spacer(modifier = Modifier.width(12.dp))
                        Column {
                            Text("Vitamin & Asam Folat", fontWeight = FontWeight.Bold, fontSize = 14.sp)
                            Text(if (vitaminTaken) "Sudah diminum hari ini" else "Jadwal: 08:00 WIB", fontSize = 11.sp, color = SlateMuted)
                        }
                    }
                    Button(
                        onClick = {
                            vitaminTaken = !vitaminTaken
                            haptic.performHapticFeedback(HapticFeedbackType.LongPress)
                        },
                        colors = ButtonDefaults.buttonColors(
                            containerColor = if (vitaminTaken) SlateMuted else Pink40
                        ),
                        shape = RoundedCornerShape(12.dp)
                    ) {
                        Text(if (vitaminTaken) "Batal" else "Minum", fontSize = 12.sp)
                    }
                }
            }

            Spacer(modifier = Modifier.height(24.dp))
        }
    }
}
