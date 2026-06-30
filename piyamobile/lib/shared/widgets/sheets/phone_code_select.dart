// ignore_for_file: public_member_api_docs, sort_constructors_first

import 'package:piyamobile/shared/models/country.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:piyamobile/shared/theme/app_spacing.dart';
import 'package:piyamobile/shared/widgets/textfields/search_textfield.dart';
import 'package:piyamobile/shared/widgets/texts/app_texts.dart';

class PhoneCodeSelector extends ConsumerStatefulWidget {
  final ScrollController scrollController;
  final List<Country> countries;

  const PhoneCodeSelector({
    super.key,
    required this.scrollController,
    required this.countries,
  });

  @override
  ConsumerState<PhoneCodeSelector> createState() => _PhoneCodeSelectorState();
}

class _PhoneCodeSelectorState extends ConsumerState<PhoneCodeSelector> {
  List<Country> filteredCountries = [], _allCountries = [];

  @override
  void initState() {
    super.initState();

    _allCountries = widget.countries..sort((a, b) => a.name.compareTo(b.name));
    filteredCountries = _allCountries;
  }

  void onQueryChanged(String query) {
    if (query.isEmpty) {
      setState(() {
        filteredCountries = _allCountries;
      });
      return;
    }

    final lowerQuery = query.toLowerCase();

    filteredCountries = _allCountries.where((country) {
      return country.name.toLowerCase().contains(lowerQuery) ||
          country.dial_code.contains(lowerQuery);
    }).toList();

    setState(() {});
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Theme.of(context).scaffoldBackgroundColor,
      body: SingleChildScrollView(
        controller: widget.scrollController,
        padding: const EdgeInsets.all(0),
        child: Column(
          children: [
            Padding(
              padding: const EdgeInsets.symmetric(
                horizontal: AppSpacings.cardPadding,
                vertical: AppSpacings.elementSpacing,
              ),
              child: AppPrimarySearchfield(
                hintText: 'Search e.g "Nigeria" or "234"',
                prefixIcon: Icon(
                  Icons.search,
                  color: Theme.of(context).iconTheme.color,
                ),
                onChanged: (value) {
                  onQueryChanged(value);
                },
              ),
            ),
            ...filteredCountries.map((country) {
              return ListTile(
                contentPadding: const EdgeInsets.symmetric(
                  horizontal: AppSpacings.cardPadding,
                ),
                onTap: () => Navigator.pop(context, country.dial_code),
                title: AppTexts.headline("+ ${country.dial_code}", context),
                leading: AppTexts.largeTitle(country.flag, context),
                subtitle: AppTexts.subheadline(
                  country.name,
                  context,
                  fontWeight: FontWeight.w400,
                  color: Theme.of(context).unselectedWidgetColor,
                ),
              );
            }),
          ],
        ),
      ),
    );
  }
}
