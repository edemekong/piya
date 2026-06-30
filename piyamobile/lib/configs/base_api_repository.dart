import 'dart:async';
import 'dart:convert';
import 'dart:io';

import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:http/http.dart' as http;
import 'package:piyamobile/configs/url_controller.dart';
import 'package:piyamobile/shared/services/auth_service.dart';
import 'package:piyamobile/utils/helpers/logs.dart';

enum RequestType {
  post('POST'),
  get('GET'),
  patch('PATCH'),
  delete('DELETE'),
  put('PUT');

  const RequestType(this.type);

  final String type;
}

abstract class BaseAPIRepository {
  final Ref ref;
  late URLController urlController;

  static const int maxRetries = 2;
  static const Duration timeout = Duration(seconds: 30);

  AuthService get _authService => ref.read(authServiceProvider);
  String? get token => _authService.token?.token;
  IdTokenResult? get tokenDetail => _authService.token;

  BaseAPIRepository(this.ref) {
    urlController = URLController();
  }

  Future<T?> runAPIRequest<T>(
    Future<T> Function(String? token) future, {
    Function(dynamic)? onError,
  }) async {
    try {
      final tokenDetail = await _authService.fetchToken();
      return await future(tokenDetail?.token);
    } catch (error, trace) {
      await onErrorInterceptor(error, trace);
      onError?.call(error);
    }

    return null;
  }

  Future<Map<String, dynamic>?> get(
    Uri url, {
    Map<String, dynamic>? queryParameters,
    Map<String, String>? headers,
    bool withToken = false,
    Function(dynamic)? onError,
  }) {
    return runAPIRequest<Map<String, dynamic>?>(
      (token) async => _decodeResponse(
        await _sendRequest(
          RequestType.get,
          _uri(url, queryParameters),
          headers: headers,
          token: token,
          withToken: withToken,
        ),
      ),
      onError: onError,
    );
  }

  Future<Map<String, dynamic>?> post(
    Uri url, {
    Object? body,
    Map<String, dynamic>? queryParameters,
    Map<String, String>? headers,
    bool withToken = false,
    Function(dynamic)? onError,
  }) {
    return runAPIRequest<Map<String, dynamic>?>(
      (token) async => _decodeResponse(
        await _sendRequest(
          RequestType.post,
          _uri(url, queryParameters),
          body: body,
          headers: headers,
          token: token,
          withToken: withToken,
        ),
      ),
      onError: onError,
    );
  }

  Future<Map<String, dynamic>?> put(
    Uri url, {
    Object? body,
    Map<String, dynamic>? queryParameters,
    Map<String, String>? headers,
    bool withToken = false,
    Function(dynamic)? onError,
  }) {
    return runAPIRequest<Map<String, dynamic>?>(
      (token) async => _decodeResponse(
        await _sendRequest(
          RequestType.put,
          _uri(url, queryParameters),
          body: body,
          headers: headers,
          token: token,
          withToken: withToken,
        ),
      ),
      onError: onError,
    );
  }

  Future<Map<String, dynamic>?> patch(
    Uri url, {
    Object? body,
    Map<String, dynamic>? queryParameters,
    Map<String, String>? headers,
    bool withToken = false,
    Function(dynamic)? onError,
  }) {
    return runAPIRequest<Map<String, dynamic>?>(
      (token) async => _decodeResponse(
        await _sendRequest(
          RequestType.patch,
          _uri(url, queryParameters),
          body: body,
          headers: headers,
          token: token,
          withToken: withToken,
        ),
      ),
      onError: onError,
    );
  }

  Future<Map<String, dynamic>?> delete(
    Uri url, {
    Object? body,
    Map<String, dynamic>? queryParameters,
    Map<String, String>? headers,
    bool withToken = false,
    Function(dynamic)? onError,
  }) {
    return runAPIRequest<Map<String, dynamic>?>(
      (token) async => _decodeResponse(
        await _sendRequest(
          RequestType.delete,
          _uri(url, queryParameters),
          body: body,
          headers: headers,
          token: token,
          withToken: withToken,
        ),
      ),
      onError: onError,
    );
  }

  Future<Map<String, dynamic>?> multipart(
    Uri url, {
    String method = 'POST',
    Map<String, String> fields = const {},
    List<http.MultipartFile> files = const [],
    Map<String, dynamic>? queryParameters,
    Map<String, String>? headers,
    bool withToken = false,
    Function(dynamic)? onError,
  }) {
    return runAPIRequest<Map<String, dynamic>?>((token) async {
      final requestUrl = _uri(url, queryParameters);
      final requestHeaders = await requestInterceptor(
        method: method,
        url: requestUrl,
        headers: _headers(headers, token: token, withToken: withToken),
        body: fields,
        token: token,
      );

      final response = await _retryRequest(() async {
        final request = http.MultipartRequest(method, requestUrl)
          ..headers.addAll(requestHeaders)
          ..fields.addAll(fields)
          ..files.addAll(files);

        final response = await http.Response.fromStream(
          await request.send().timeout(timeout),
        );
        return responseInterceptor(response);
      });

      return _decodeResponse(response);
    }, onError: onError);
  }

  Future<Map<String, String>> requestInterceptor({
    required String method,
    required Uri url,
    required Map<String, String> headers,
    Object? body,
    String? token,
  }) async {
    logPrint('$method $url', name: 'API');
    return headers;
  }

  Future<http.Response> responseInterceptor(http.Response response) async {
    logPrint('${response.request?.url} ${response.statusCode}', name: 'API');
    return response;
  }

  Future<void> onErrorInterceptor(Object error, [StackTrace? trace]) async {
    logPrint(error, name: 'API', error: error, trace: trace);
  }

  Future<http.Response> _sendRequest(
    RequestType method,
    Uri url, {
    Object? body,
    Map<String, String>? headers,
    String? token,
    bool withToken = false,
  }) async {
    final requestHeaders = await requestInterceptor(
      method: method.type,
      url: url,
      headers: _headers(headers, token: token, withToken: withToken),
      body: body,
      token: token,
    );

    return _retryRequest(() async {
      final response = await switch (method) {
        RequestType.get =>
          http.get(url, headers: requestHeaders).timeout(timeout),
        RequestType.post =>
          http
              .post(url, headers: requestHeaders, body: _body(body))
              .timeout(timeout),
        RequestType.put =>
          http
              .put(url, headers: requestHeaders, body: _body(body))
              .timeout(timeout),
        RequestType.patch =>
          http
              .patch(url, headers: requestHeaders, body: _body(body))
              .timeout(timeout),
        RequestType.delete =>
          http
              .delete(url, headers: requestHeaders, body: _body(body))
              .timeout(timeout),
      };

      return responseInterceptor(response);
    });
  }

  Future<http.Response> _retryRequest(
    Future<http.Response> Function() request,
  ) async {
    for (var attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        final response = await request();
        if (!_shouldRetry(response.statusCode) || attempt == maxRetries) {
          return response;
        }
      } on TimeoutException catch (error, trace) {
        if (attempt == maxRetries) {
          await onErrorInterceptor(error, trace);
          rethrow;
        }
      } on SocketException catch (error, trace) {
        if (attempt == maxRetries) {
          await onErrorInterceptor(error, trace);
          rethrow;
        }
      } on http.ClientException catch (error, trace) {
        if (attempt == maxRetries) {
          await onErrorInterceptor(error, trace);
          rethrow;
        }
      }

      await Future.delayed(Duration(milliseconds: 500 * (attempt + 1)));
    }

    throw StateError('Request failed');
  }

  bool _shouldRetry(int statusCode) {
    return statusCode == HttpStatus.requestTimeout ||
        statusCode == HttpStatus.tooManyRequests ||
        statusCode >= HttpStatus.internalServerError;
  }

  Map<String, String> _headers(
    Map<String, String>? headers, {
    String? token,
    bool withToken = false,
  }) {
    return {
      HttpHeaders.acceptHeader: 'application/json',
      HttpHeaders.contentTypeHeader: 'application/json',
      if (withToken && token != null) ...{
        HttpHeaders.authorizationHeader: 'Bearer $token',
        "x-access-token": token,
      },
      ...?headers,
    };
  }

  Object? _body(Object? body) {
    if (body == null || body is String) return body;
    return jsonEncode(body);
  }

  Uri _uri(Uri url, Map<String, dynamic>? queryParameters) {
    if (queryParameters == null || queryParameters.isEmpty) return url;

    return url.replace(
      queryParameters: {
        ...url.queryParameters,
        ...queryParameters.map((key, value) => MapEntry(key, '$value')),
      },
    );
  }

  Map<String, dynamic>? _decodeResponse(http.Response? response) {
    logPrint("API RESPONSE+++: ${response?.body}");
    if (response == null || response.body.isEmpty) return null;

    final decoded = jsonDecode(response.body);
    if (decoded is Map) return decoded.cast<String, dynamic>();

    return {'data': decoded};
  }
}
