import { useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

const MONTHS_ID = [
  'Januari',
  'Februari',
  'Maret',
  'April',
  'Mei',
  'Juni',
  'Juli',
  'Agustus',
  'September',
  'Oktober',
  'November',
  'Desember',
];

const WEEKDAYS_ID = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

export function formatIndonesianDate(date) {
  if (!date) return '';
  return `${date.getDate()} ${MONTHS_ID[date.getMonth()]} ${date.getFullYear()}`;
}

/** Formats an ISO YYYY-MM-DD date string in Indonesian, e.g. "26 November 2026". */
export function formatIsoDateLabel(isoDate) {
  if (typeof isoDate !== 'string') {
    return '';
  }
  const parts = isoDate.split('-').map(Number);
  if (parts.length !== 3 || parts.some((n) => !Number.isInteger(n))) {
    return isoDate;
  }
  const [year, month, day] = parts;
  const parsed = new Date(year, month - 1, day);
  if (Number.isNaN(parsed.getTime())) {
    return isoDate;
  }
  return formatIndonesianDate(parsed);
}

function isSameDay(a, b) {
  return Boolean(
    a &&
    b &&
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

/** Calendar modal for selecting an observation date. */
export default function DatePickerModal({ visible, selectedDate, onSelect, onClose }) {
  const initialDate = selectedDate ?? new Date();
  const [viewYear, setViewYear] = useState(initialDate.getFullYear());
  const [viewMonth, setViewMonth] = useState(initialDate.getMonth());

  const syncViewToSelection = () => {
    const anchor = selectedDate ?? new Date();
    setViewYear(anchor.getFullYear());
    setViewMonth(anchor.getMonth());
  };

  const changeMonth = (delta) => {
    const next = new Date(viewYear, viewMonth + delta, 1);
    setViewYear(next.getFullYear());
    setViewMonth(next.getMonth());
  };

  const firstWeekday = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const cells = [
    ...Array.from({ length: firstWeekday }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) {
    cells.push(null);
  }

  const weeks = [];
  for (let i = 0; i < cells.length; i += 7) {
    weeks.push(cells.slice(i, i + 7));
  }

  const today = new Date();

  return (
    <Modal visible={visible} transparent animationType="fade" onShow={syncViewToSelection} onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.dialog} onPress={() => {}}>
          <View style={styles.header}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Bulan sebelumnya"
              onPress={() => changeMonth(-1)}
              style={styles.navButton}
            >
              <Text style={styles.navLabel}>‹</Text>
            </Pressable>
            <Text style={styles.monthLabel}>{`${MONTHS_ID[viewMonth]} ${viewYear}`}</Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Bulan berikutnya"
              onPress={() => changeMonth(1)}
              style={styles.navButton}
            >
              <Text style={styles.navLabel}>›</Text>
            </Pressable>
          </View>

          <View style={styles.weekRow}>
            {WEEKDAYS_ID.map((day) => (
              <Text key={day} style={styles.weekdayLabel}>
                {day}
              </Text>
            ))}
          </View>

          {weeks.map((week, weekIndex) => (
            <View key={weekIndex} style={styles.weekRow}>
              {week.map((day, dayIndex) => {
                if (!day) {
                  return <View key={`empty-${dayIndex}`} style={styles.dayCell} />;
                }

                const cellDate = new Date(viewYear, viewMonth, day);
                const selected = isSameDay(cellDate, selectedDate);
                const isToday = isSameDay(cellDate, today);

                return (
                  <Pressable
                    key={day}
                    accessibilityRole="button"
                    accessibilityLabel={formatIndonesianDate(cellDate)}
                    accessibilityState={{ selected }}
                    onPress={() => {
                      onSelect(cellDate);
                      onClose();
                    }}
                    style={[
                      styles.dayCell,
                      isToday && !selected && styles.todayCell,
                      selected && styles.selectedCell,
                    ]}
                  >
                    <Text style={[styles.dayText, selected && styles.selectedDayText]}>{day}</Text>
                  </Pressable>
                );
              })}
            </View>
          ))}

          <View style={styles.footer}>
            <Pressable
              accessibilityRole="button"
              onPress={() => {
                const now = new Date();
                onSelect(new Date(now.getFullYear(), now.getMonth(), now.getDate()));
                onClose();
              }}
              style={styles.secondaryButton}
            >
              <Text style={styles.secondaryButtonLabel}>Hari Ini</Text>
            </Pressable>
            <Pressable accessibilityRole="button" onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonLabel}>Tutup</Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  dialog: {
    width: '100%',
    maxWidth: 360,
    borderRadius: 24,
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  navButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#EDF7F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  navLabel: {
    color: '#005E36',
    fontSize: 22,
    lineHeight: 24,
    fontWeight: '600',
  },
  monthLabel: {
    color: '#000000',
    fontFamily: 'Poppins-SemiBold',
    fontWeight: '600',
    fontSize: 16,
  },
  weekRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  weekdayLabel: {
    width: 38,
    textAlign: 'center',
    color: '#6B7280',
    fontFamily: 'Poppins-Medium',
    fontWeight: '500',
    fontSize: 12,
  },
  dayCell: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  todayCell: {
    borderWidth: 1,
    borderColor: '#005E36',
  },
  selectedCell: {
    backgroundColor: '#005E36',
  },
  dayText: {
    color: '#000000',
    fontFamily: 'Poppins-Medium',
    fontWeight: '500',
    fontSize: 14,
  },
  selectedDayText: {
    color: '#FFFFFF',
  },
  footer: {
    marginTop: 14,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
  secondaryButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: '#EDF7F0',
  },
  secondaryButtonLabel: {
    color: '#005E36',
    fontFamily: 'Poppins-SemiBold',
    fontWeight: '600',
    fontSize: 13,
  },
  closeButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: '#1C5C3D',
  },
  closeButtonLabel: {
    color: '#FFFFFF',
    fontFamily: 'Poppins-SemiBold',
    fontWeight: '600',
    fontSize: 13,
  },
});
