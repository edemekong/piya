// ignore_for_file: non_constant_identifier_names

class Country {
  final String name;
  final String dial_code;
  final String flag;
  final String code;

  const Country({required this.name, required this.dial_code, required this.flag, required this.code});

  factory Country.fromMap(Map<String, dynamic> map) {
    return Country(
      name: map['name'] ?? '',
      dial_code: map['dial_code'] ?? '',
      flag: map['flag'] ?? '',
      code: map['code'] ?? '',
    );
  }
}
