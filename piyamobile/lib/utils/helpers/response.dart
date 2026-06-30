
import 'package:flutter/foundation.dart';

enum ResultState { idle, loading }

@immutable
class DataResult<T> {
  final T data;
  final Map<String, dynamic> meta;
  final ResultState state;

  bool get isLoading => state == ResultState.loading;

  const DataResult({
    required this.data,
    this.meta = const {},
    required this.state,
  });

  factory DataResult.initial({
    required T data,
    Map<String, dynamic> meta = const {},
  }) {
    return DataResult(data: data, state: ResultState.idle, meta: meta);
  }

  DataResult<T> copyWith({
    T? data,
    Map<String, dynamic>? meta,
    ResultState? state,
  }) {
    return DataResult<T>(
      data: data ?? this.data,
      meta: meta ?? this.meta,
      state: state ?? this.state,
    );
  }

  @override
  bool operator ==(covariant DataResult<T> other) {
    if (identical(this, other)) return true;

    return other.data == data &&
        mapEquals(other.meta, meta) &&
        other.state == state;
  }

  @override
  int get hashCode => data.hashCode ^ meta.hashCode ^ state.hashCode;
}