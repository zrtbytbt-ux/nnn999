import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:flutter/foundation.dart';

class RemoteFeatureControl {
  // رابط ملف JSON المباشر من GitHub (بدون Netlify!)
  static const String featuresUrl =
      'https://raw.githubusercontent.com/zrtbytbt-ux/nnn999/main/public/features.json';

  /// قراءة حالة الأقسام من GitHub
  static Future<Map<String, bool>> getFeatures() async {
    try {
      final response = await http.get(
        Uri.parse(featuresUrl),
        headers: {'Cache-Control': 'no-cache'},
      );

      if (response.statusCode == 200) {
        final Map<String, dynamic> data = jsonDecode(response.body);
        return Map<String, bool>.from(data);
      } else {
        if (kDebugMode) {
          debugPrint('خطأ في قراءة الأقسام: ${response.statusCode}');
        }
        return _getDefaultFeatures();
      }
    } catch (e) {
      if (kDebugMode) {
        debugPrint('خطأ في الاتصال: $e');
      }
      return _getDefaultFeatures();
    }
  }

  /// التحقق من حالة قسم معين
  static Future<bool> isFeatureEnabled(String featureName) async {
    final features = await getFeatures();
    return features[featureName] ?? true;
  }

  /// القيم الافتراضية
  static Map<String, bool> _getDefaultFeatures() {
    return {
      'voiceRooms': true,
      'tribes': true,
      'adhkar': true,
      'quizzes': true,
    };
  }
}
