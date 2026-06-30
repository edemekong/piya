// check if the email is valid
import 'package:intl/intl.dart';

final RegExp emailRegex = RegExp(
  r'^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$',
);
final RegExp ninRegex = RegExp(r'^\d{11}$');

final RegExp passportRegex = RegExp(r'^[A-Z0-9]{6,}$');

final RegExp driverLicenseRegex = RegExp(r'^[A-Z0-9]{6,}$');

final RegExp portalCodeRegex = RegExp(r'^[A-Z0-9\s\-]{3,10}$');

final RegExp phoneRegex = RegExp(r'^\+?[1-9]\d{1,14}$');

final RegExp passwordRegex = RegExp(r'^(?=.*[A-Z])(?=.*[!@#\$&*~]).+$');

class AppValidations {
  const AppValidations._();

  static String? validatedPostalCode(
    String? value, {
    String label = "Postal Code",
  }) {
    String? result;

    if (value != null && value.trim().isEmpty) {
      result = "$label can't be empty";
    } else {
      result = null;
    }

    return result;
  }

  static String? validatedState(String? value, {String label = "State"}) {
    String? result;
    if (value != null && value.trim().isEmpty) {
      result = "$label can't be empty";
    } else {
      result = null;
    }

    return result;
  }

  static String? validatedCity(String? value, {String label = "City"}) {
    String? result;
    if (value != null && value.trim().isEmpty) {
      result = "$label can't be empty";
    } else {
      result = null;
    }

    return result;
  }

  static String? validatedAddressLine(
    String? value, {
    String label = "Address Line",
  }) {
    String? result;
    if (value != null && value.trim().isEmpty) {
      result = "$label can't be empty";
    } else {
      result = null;
    }

    return result;
  }

  static String? validatedName(String? value, {String label = "Name"}) {
    String? result;
    if (value != null && value.trim().isEmpty) {
      result = "$label can't be empty";
    } else {
      result = null;
    }

    return result;
  }

  static String? validatedEmail(String? value) {
    String? result;
    if (value != null) {
      if (value.trim().isEmpty) {
        result = "Email cannot be empty";
      } else if (!emailRegex.hasMatch(value)) {
        result = "Invalid email";
      }
    } else {
      result = null;
    }
    return result;
  }

  static String? validatePassword(String? password) {
    // Check if the password is null or empty
    if (password == null || password.isEmpty) {
      return 'Password is required';
    }

    // Validate the password
    if (!passwordRegex.hasMatch(password)) {
      return 'Password must contain at least \none capital letter and one special character';
    }

    // If everything is fine, return null (no error)
    return null;
  }

  static String? validatedPhone(String? value) {
    String? result;

    if (value != null) {
      if (value.trim().isEmpty) {
        result = "Phone Number can't be empty";
      } else if (!phoneRegex.hasMatch(value)) {
        result = "Invalid Phone Number";
      } else {
        result = null;
      }
    } else {
      result = null;
    }

    return result;
  }

  static String? validatedNIN(String? value) {
    String? result;
    final nin = value?.trim() ?? '';

    if (nin.isEmpty) {
      result = "NIN is required";
    } else if (!ninRegex.hasMatch(nin)) {
      result = "NIN must be 11 digits";
    } else {
      result = null;
    }

    return result;
  }

  static String? validatedPassportNumber(String? value) {
    String? result;

    if (value != null && value.trim().isEmpty) {
      result = "Passport Number is empty";
    } else if (value != null && !passportRegex.hasMatch(value.trim())) {
      result = "Invalid Passport Number";
    } else {
      result = null;
    }

    return result;
  }

  static String? validateDriverLicenseNumber(String? value) {
    String? result;
    if (value != null && value.trim().isEmpty) {
      result = "Driver's License Number is empty";
    } else if (value != null && !driverLicenseRegex.hasMatch(value.trim())) {
      result = "Invalid Driver's License Number";
    } else {
      result = null;
    }

    return result;
  }

  static String? validateOtp(String? value) {
    String? result;
    String? newValue = value?.replaceAll('-', '').replaceAll('_', '');

    if (newValue?.isEmpty == true) {
      result = 'otp is required';
    } else if (newValue != null && newValue.length > 5) {
      result = null;
    } else {
      result = 'otp must be 6 digits';
    }

    return result;
  }

  static String? validatedDOB(String? value) {
    String? result;
    if (value != null && value.isNotEmpty) {
      value = value.replaceAll('-', '/');
    }
    if (value != null && value.length >= 10) {
      try {
        final date = DateFormat('dd/MM/yyyy', 'en_US').parse(value);
        final now = DateTime.now();

        if (now.year - date.year >= 9 && now.year - date.year <= 100) {
          result = null;
        } else {
          result = 'You must be 9+';
        }
      } catch (e) {
        result = 'Invalid Date - use DD/MM/YYYY format';
      }
    } else if (value == null || value.isEmpty) {
      result = 'Invalid Date';
    }

    return result;
  }

  static String? validateMaxLength(
    String? value, {
    String label = "Field",
    int maxLength = 20,
  }) {
    if (value == null || value.isEmpty) {
      return "$label can't be empty";
    }

    // Parse the string to a number

    if (value.length < maxLength) {
      return '$label must be greater than or equal to $maxLength';
    }

    return null;
  }

  // validate amount, so i can't withdraw more than my balance
  static String? validateAmount(String? value, double balance) {
    if (value == null || value.isEmpty) {
      return "Amount can't be empty";
    }
    final amount = double.tryParse(value.replaceAll(',', ''));
    if (amount == null) {
      return "Invalid amount";
    } else if (amount <= 0) {
      return "Amount must be greater than zero";
    } else if (balance - amount < 1000 && amount == balance) {
      return "Minimum balance of 1000 must be maintained";
    } else if (amount > balance) {
      return "Insufficient balance";
    }
    return null;
  }

  // must be valid email && the email must match
  static String? validateEmailMatch(
    String? value, {
    required String confirmEmail,
  }) {
    if (value == null || value.isEmpty) {
      return "Email can't be empty";
    }
    if (confirmEmail.isEmpty) {
      return "User's Email can't be empty, an error occured";
    }
    if (value.trim() != confirmEmail.trim()) {
      return "Emails do not match";
    }
    return null;
  }
}
