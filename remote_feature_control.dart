import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:flutter/foundation.dart';

class RemoteFeatureControl {
  // استخدام GitHub API بدلاً من raw (لتجنب مشكلة الـ cache)
  static const String featuresUrl =
      'https://api.github.com/repos/zrtbytbt-ux/nnn999/contents/public/features.json';

  /// قراءة حالة الأقسام من GitHub API
  static Future<Map<String, bool>> getFeatures() async {
    try {
      final response = await http.get(
        Uri.parse(featuresUrl),
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'Cache-Control': 'no-cache',
        },
      );

      if (response.statusCode == 200) {
        final Map<String, dynamic> apiResponse = jsonDecode(response.body);

        // GitHub API يرجع الملف مشفر بـ base64
        final String content = apiResponse['content'];
        final String decodedContent = utf8.decode(
          base64.decode(content.replaceAll('\n', '')),
        );

        final Map<String, dynamic> features = jsonDecode(decodedContent);
        return Map<String, bool>.from(features);
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

// ═══════════════════════════════════════════════════════
// مثال الاستخدام (نفس الشيء - لا تغيير!)
// ═══════════════════════════════════════════════════════

/*

import 'services/remote_feature_control.dart';

// في أي مكان في التطبيق:
final features = await RemoteFeatureControl.getFeatures();

if (features['voiceRooms'] == true) {
  // أظهر الغرف الصوتية
}

if (features['tribes'] == false) {
  // أخف القبائل
}

// أو استخدام مباشر:
final isEnabled = await RemoteFeatureControl.isFeatureEnabled('voiceRooms');
if (!isEnabled) {
  // القسم معطّل
}

*/
