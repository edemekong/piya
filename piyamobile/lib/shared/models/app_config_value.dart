class AppConfigValues {
  final String mapApiKey;
  final String googlePlacesApiKey;
  final String algoliaAppId;
  final String algoliaSearchKey;
  final String agoraAppId;
  final String clientId;
  final String baseUrl;

  const AppConfigValues({
    required this.mapApiKey,
    required this.baseUrl,
    required this.googlePlacesApiKey,
    required this.algoliaAppId,
    required this.algoliaSearchKey,
    required this.agoraAppId,
    required this.clientId,
  });
}
