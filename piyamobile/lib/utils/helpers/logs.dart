import 'dart:developer' as dev;

void logPrint(
  dynamic message, {
  String name = 'Piya',
  Object? error,
  StackTrace? trace,
}) {
  dev.log(message, name: name);
}
