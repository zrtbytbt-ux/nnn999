import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:flutter/foundation.dart';

class RemoteFeatureControl {
  // رابط ملف JSON المباشر على Netlify
  static const String featuresUrl =
      'https://cccxxxzzssee.netlify.app/features.json';

  /// قراءة حالة الأقسام من السيرفر
  static Future<Map<String, bool>> getFeatures() async {
    try {
      final response = await http.get(
        Uri.parse(featuresUrl),
        headers: {'Cache-Control': 'no-cache'}, // منع التخزين المؤقت
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
        debugPrint('خطأ في الاتصال بالسيرفر: $e');
      }
      return _getDefaultFeatures();
    }
  }

  /// التحقق من حالة قسم معين
  static Future<bool> isFeatureEnabled(String featureName) async {
    final features = await getFeatures();
    return features[featureName] ?? true; // افتراضياً مفعّل
  }

  /// القيم الافتراضية في حالة فشل الاتصال
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
// مثال الاستخدام
// ═══════════════════════════════════════════════════════

/*

import 'services/remote_feature_control.dart';

// في أي مكان في التطبيق:
class MyHomePage extends StatefulWidget {
  @override
  _MyHomePageState createState() => _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> {
  Map<String, bool> features = {};
  bool loading = true;

  @override
  void initState() {
    super.initState();
    _loadFeatures();
  }

  Future<void> _loadFeatures() async {
    final f = await RemoteFeatureControl.getFeatures();
    setState(() {
      features = f;
      loading = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    if (loading) {
      return CircularProgressIndicator();
    }

    return Column(
      children: [
        // الغرف الصوتية
        if (features['voiceRooms'] == true)
          ListTile(
            title: Text('الغرف الصوتية'),
            onTap: () {
              // انتقل للغرف الصوتية
            },
          ),

        // القبائل
        if (features['tribes'] == true)
          ListTile(
            title: Text('القبائل'),
            onTap: () {
              // انتقل للقبائل
            },
          ),

        // أذكاري
        if (features['adhkar'] == true)
          ListTile(
            title: Text('أذكاري'),
            onTap: () {
              // انتقل للأذكار
            },
          ),

        // الاختبارات
        if (features['quizzes'] == true)
          ListTile(
            title: Text('الاختبارات'),
            onTap: () {
              // انتقل للاختبارات
            },
          ),
      ],
    );
  }
}

// أو استخدام مباشر:
final isVoiceRoomsEnabled = await RemoteFeatureControl.isFeatureEnabled('voiceRooms');
if (isVoiceRoomsEnabled) {
  // أظهر الغرف الصوتية
}

*/
