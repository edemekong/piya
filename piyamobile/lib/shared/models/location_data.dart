// ignore_for_file: public_member_api_docs, sort_constructors_first
import 'dart:convert';

class LocationData {
  final String? displayName;
  final String address;
  final String city;
  final String state;
  final String? serviceLocationId;
  final String country;
  final String? postalCode;
  final GeoPointData? geoPoint;

  final double heading;
  final double speed;

  String get formattedAddress =>
      '${displayName ?? address}, $city, $state';

  const LocationData({
    this.displayName,
    required this.address,
    required this.city,
    required this.state,
    this.serviceLocationId,
    required this.country,
    this.postalCode,
    this.geoPoint,
    this.heading = 0,
    this.speed = 0,
  });

  LocationData copyWith({
    String? displayName,
    String? address,
    String? city,
    String? state,
    String? serviceLocationId,
    String? country,
    String? postalCode,
    GeoPointData? geoPoint,
    double? heading,
    double? speed,
  }) {
    return LocationData(
      displayName: displayName ?? this.displayName,
      address: address ?? this.address,
      city: city ?? this.city,
      state: state ?? this.state,
      serviceLocationId: serviceLocationId ?? this.serviceLocationId,
      country: country ?? this.country,
      postalCode: postalCode ?? this.postalCode,
      geoPoint: geoPoint ?? this.geoPoint,
      heading: heading ?? this.heading,
      speed: speed ?? this.speed,
    );
  }

  Map<String, dynamic> toMap() {
    return <String, dynamic>{
      'address': address,
      'city': city,
      'state': state,
      'serviceLocationId': serviceLocationId,
      'country': country,
      'postalCode': postalCode,
      'geoPoint': geoPoint?.toMap(),
    };
  }

  factory LocationData.fromMap(Map<String, dynamic> map) {
    return LocationData(
      displayName:
          map['displayName'] != null ? map['displayName'] as String : null,
      address: map['address'] ?? "",
      city: map['city'] ?? "",
      state: map['state'] ?? "",
      serviceLocationId:
          map['serviceLocationId'] != null
              ? map['serviceLocationId'] as String
              : null,
      country: map['country'] ?? "",
      postalCode:
          map['postalCode'] != null ? map['postalCode'] as String : null,
      geoPoint:
          map['geoPoint'] != null
              ? GeoPointData.fromMap(map['geoPoint'] as Map<String, dynamic>)
              : null,
    );
  }

  String toJson() => json.encode(toMap());

  factory LocationData.fromJson(String source) =>
      LocationData.fromMap(json.decode(source) as Map<String, dynamic>);

  @override
  String toString() {
    return 'Location(displayName: $displayName, address: $address, city: $city, state: $state, serviceLocationId: $serviceLocationId, country: $country, postalCode: $postalCode, geoPoint: $geoPoint)';
  }

  @override
  bool operator ==(covariant LocationData other) {
    if (identical(this, other)) return true;

    return other.address == address &&
        other.city == city &&
        other.state == state &&
        other.serviceLocationId == serviceLocationId &&
        other.country == country &&
        other.postalCode == postalCode &&
        other.geoPoint == geoPoint;
  }

  @override
  int get hashCode {
    return address.hashCode ^
        city.hashCode ^
        state.hashCode ^
        serviceLocationId.hashCode ^
        country.hashCode ^
        postalCode.hashCode ^
        geoPoint.hashCode;
  }
}

class MiniLocationData {
  final String formattedAddress;
  final String? serviceLocationId;
  final GeoPointData? geoPoint;

  const MiniLocationData({
    required this.formattedAddress,
    this.serviceLocationId,
    this.geoPoint,
  });

  factory MiniLocationData.fromLocationData(LocationData locationData) {
    return MiniLocationData(
      formattedAddress: locationData.formattedAddress,
      serviceLocationId: locationData.serviceLocationId,
      geoPoint: locationData.geoPoint,
    );
  }

  MiniLocationData copyWith({
    String? formattedAddress,
    String? serviceLocationId,
    GeoPointData? geoPoint,
  }) {
    return MiniLocationData(
      formattedAddress: formattedAddress ?? this.formattedAddress,
      serviceLocationId: serviceLocationId ?? this.serviceLocationId,
      geoPoint: geoPoint ?? this.geoPoint,
    );
  }

  Map<String, dynamic> toMap() {
    return <String, dynamic>{
      'formattedAddress': formattedAddress,
      'serviceLocationId': serviceLocationId,
      'geoPoint': geoPoint?.toMap(),
    };
  }

  factory MiniLocationData.fromMap(Map<String, dynamic> map) {
    return MiniLocationData(
      formattedAddress: map['formattedAddress'] as String,
      serviceLocationId:
          map['serviceLocationId'] != null
              ? map['serviceLocationId'] as String
              : null,
      geoPoint:
          map['geoPoint'] != null
              ? GeoPointData.fromMap(map['geoPoint'] as Map<String, dynamic>)
              : null,
    );
  }

  String toJson() => json.encode(toMap());

  factory MiniLocationData.fromJson(String source) =>
      MiniLocationData.fromMap(json.decode(source) as Map<String, dynamic>);

  @override
  String toString() =>
      'MiniLocation(formattedAddress: $formattedAddress, serviceLocationId: $serviceLocationId, geoPoint: $geoPoint)';

  @override
  bool operator ==(covariant MiniLocationData other) {
    if (identical(this, other)) return true;

    return other.formattedAddress == formattedAddress &&
        other.serviceLocationId == serviceLocationId &&
        other.geoPoint == geoPoint;
  }

  @override
  int get hashCode =>
      formattedAddress.hashCode ^
      serviceLocationId.hashCode ^
      geoPoint.hashCode;
}

class GeoPointData {
  final double lat;
  final double lng;

  const GeoPointData({required this.lat, required this.lng});

  GeoPointData copyWith({double? lat, double? lng}) {
    return GeoPointData(lat: lat ?? this.lat, lng: lng ?? this.lng);
  }

  Map<String, dynamic> toMap() {
    return <String, dynamic>{'lat': lat, 'lng': lng};
  }

  factory GeoPointData.fromMap(Map<String, dynamic> map) {
    return GeoPointData(
      lat: (map['lat'] ?? map['latitude'] ?? 0).toDouble(),
      lng: (map['lng'] ?? map['longitude'] ?? 0).toDouble(),
    );
  }

  String toJson() => json.encode(toMap());

  factory GeoPointData.fromJson(String source) =>
      GeoPointData.fromMap(json.decode(source) as Map<String, dynamic>);

  @override
  String toString() => 'GeoPoint(lat: $lat, lng: $lng)';

  @override
  bool operator ==(covariant GeoPointData other) {
    if (identical(this, other)) return true;

    return other.lat == lat && other.lng == lng;
  }

  @override
  int get hashCode => lat.hashCode ^ lng.hashCode;
}
