import React, { useState } from 'react';
import {
  Text,
  SafeAreaView,
  StyleSheet,
  TextInput,
  ScrollView,
  View,
  Button,
  Platform,
} from 'react-native';
import { Card } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import Slider from '@react-native-community/slider';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function App() {
  const [idBarang, setIdBarang] = useState('');
  const [namaBarang, setNamaBarang] = useState('');
  const [namaPengirim, setNamaPengirim] = useState('');
  const [pesan, setPesan] = useState('');
  const [alamat, setAlamat] = useState('');
  const [pengiriman, setPengiriman] = useState('JNE');
  const [banyakBarang, setBanyakBarang] = useState(1);
  const [tanggal, setTanggal] = useState(new Date());
  const [penerima, setPenerima] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dataTerkirim, setDataTerkirim] = useState([]);

  const estimasiTiba = (kurir, tanggalKirim) => {
    const estimasiHari = {
      JNE: 3,
      TIKI: 2,
      POS: 5,
    };
    const hari = estimasiHari[kurir] || 3;
    const estimasi = new Date(tanggalKirim);
    estimasi.setDate(estimasi.getDate() + hari);
    return estimasi.toDateString();
  };

  const simpanData = () => {
    if (!idBarang || !namaBarang || !alamat || !penerima || !namaPengirim) {
      alert('Harap lengkapi semua data terlebih dahulu.');
      return;
    }

    const dataBaru = {
      id: parseInt(idBarang),
      nama: namaBarang,
      alamat,
      pengiriman,
      banyakBarang,
      tanggal: tanggal.toDateString(),
      estimasi: estimasiTiba(pengiriman, tanggal),
      penerima,
      pengirim: namaPengirim,
      pesan,
    };

    setDataTerkirim([...dataTerkirim, dataBaru]);

    // Reset form
    setIdBarang('');
    setNamaBarang('');
    setAlamat('');
    setPengiriman('JNE');
    setBanyakBarang(1);
    setTanggal(new Date());
    setPenerima('');
    setNamaPengirim('');
    setPesan('');
  };

  const handleDateChange = (event, selectedDate) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }

    if (selectedDate) {
      setTanggal(selectedDate);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Text style={styles.header}>Pepeng Express</Text>

        <TextInput
          placeholder="ID Barang"
          style={styles.input}
          value={idBarang}
          onChangeText={(text) => {
            const numericText = text.replace(/[^0-9]/g, '');
            setIdBarang(numericText);
          }}
          keyboardType="numeric"
        />

        <TextInput
          placeholder="Nama Barang"
          style={styles.input}
          value={namaBarang}
          onChangeText={setNamaBarang}
        />

        <TextInput
          placeholder="Nama Pengirim"
          style={styles.input}
          value={namaPengirim}
          onChangeText={setNamaPengirim}
        />

        <TextInput
          placeholder="Alamat Tujuan"
          multiline
          numberOfLines={4}
          style={styles.textArea}
          value={alamat}
          onChangeText={setAlamat}
        />

        <Text>Metode Pengiriman</Text>
        <Picker
          selectedValue={pengiriman}
          onValueChange={(itemValue) => setPengiriman(itemValue)}
          style={styles.picker}>
          <Picker.Item label="JNE" value="JNE" />
          <Picker.Item label="TIKI" value="TIKI" />
          <Picker.Item label="POS Indonesia" value="POS" />
        </Picker>

        <Text>Banyak Barang: {banyakBarang}</Text>
        <Slider
          minimumValue={1}
          maximumValue={10}
          step={1}
          value={banyakBarang}
          onValueChange={setBanyakBarang}
        />

        <Text>Tanggal Kirim: {tanggal.toDateString()}</Text>
        <Button title="Pilih Tanggal" onPress={() => setShowDatePicker(true)} />
        {showDatePicker && (
          <View>
            <DateTimePicker
              value={tanggal}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={handleDateChange}
            />
            {Platform.OS === 'ios' && (
              <Button title="Selesai" onPress={() => setShowDatePicker(false)} />
            )}
          </View>
        )}

        <TextInput
          placeholder="Nama Penerima"
          style={styles.input}
          value={penerima}
          onChangeText={setPenerima}
        />

        <TextInput
          placeholder="Pesan untuk Penerima"
          style={styles.input}
          value={pesan}
          onChangeText={setPesan}
        />

        <Button title="Simpan" onPress={simpanData} />

        <Text style={styles.listHeader}>Data Terkirim:</Text>
        {dataTerkirim.map((item, index) => (
          <Card key={index} style={styles.card}>
            <Text>ID: {item.id}</Text>
            <Text>Nama: {item.nama}</Text>
            <Text>Pengirim: {item.pengirim}</Text>
            <Text>Alamat: {item.alamat}</Text>
            <Text>Kurir: {item.pengiriman}</Text>
            <Text>Banyak: {item.banyakBarang}</Text>
            <Text>Tanggal Kirim: {item.tanggal}</Text>
            <Text>Estimasi Tiba: {item.estimasi}</Text>
            <Text>Penerima: {item.penerima}</Text>
            <Text>Pesan: {item.pesan}</Text>
          </Card>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#ecf0f1',
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#fff',
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
  },
  textArea: {
    backgroundColor: '#fff',
    padding: 10,
    height: 100,
    marginVertical: 5,
    borderRadius: 5,
    textAlignVertical: 'top',
  },
  picker: {
    backgroundColor: '#fff',
    marginVertical: 5,
  },
  listHeader: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: 'bold',
  },
  card: {
    marginVertical: 5,
    padding: 10,
  },
});
