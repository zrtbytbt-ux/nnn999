import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:flutter/foundation.dart';

class RemoteFeatureControl {
  // رابط السيرفر على Netlify
  static const String baseUrl = 'https://cccxxxzzssee.netlify.app';

  /// قراءة حالة الأقسام من السيرفر
  static Future<Map<String, bool>> getFeatures() async {
    try {
      final response = await http.get(Uri.parse('$baseUrl/api/get-features'));

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        return Map<String, bool>.from(data['features']);
      } else {
        if (kDebugMode) {
          debugPrint('Error fetching features: ${response.statusCode}');
        }
        return _getDefaultFeatures();
      }
    } catch (e) {
      if (kDebugMode) {
        debugPrint('Error fetching features: $e');
      }
      return _getDefaultFeatures();
    }
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

  /// فحص إذا كان قسم معين مفعّل
  static Future<bool> isFeatureEnabled(String featureName) async {
    final features = await getFeatures();
    return features[featureName] ?? true; // افتراضياً مفعّل
  }
}

// ============================================
// 📝 مثال على الاستخدام في التطبيق:
// ============================================

/*

// في main.dart أو أي مكان تحتاجه:

class MyApp extends StatefulWidget {
  @override
  _MyAppState createState() => _MyAppState();
}

class _MyAppState extends State<MyApp> {
  Map<String, bool> features = {};
  
  @override
  void initState() {
    super.initState();
    loadFeatures();
  }
  
  Future<void> loadFeatures() async {
    final f = await RemoteFeatureControl.getFeatures();
    setState(() {
      features = f;
    });
  }
  
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: Scaffold(
        body: ListView(
          children: [
            // الغرف الصوتية - تظهر فقط إذا كانت مفعّلة
            if (features['voiceRooms'] == true)
              ListTile(
                title: Text('الغرف الصوتية'),
                onTap: () {
                  // انتقل لصفحة الغرف الصوتية
                },
              ),
            
            // القبائل - تظهر فقط إذا كانت مفعّلة
            if (features['tribes'] == true)
              ListTile(
                title: Text('القبائل'),
                onTap: () {
                  // انتقل لصفحة القبائل
                },
              ),
            
            // أذكاري
            if (features['adhkar'] == true)
              ListTile(
                title: Text('أذكاري'),
                onTap: () {
                  // انتقل لصفحة الأذكار
                },
              ),
            
            // الاختبارات
            if (features['quizzes'] == true)
              ListTile(
                title: Text('الاختبارات'),
                onTap: () {
                  // انتقل لصفحة الاختبارات
                },
              ),
          ],
        ),
      ),
    );
  }
}

// ============================================
// أو استخدم هذه الطريقة الأبسط:
// ============================================

// في أي صفحة:
FutureBuilder<bool>(
  future: RemoteFeatureControl.isFeatureEnabled('voiceRooms'),
  builder: (context, snapshot) {
    if (snapshot.data == true) {
      return VoiceRoomsSection();
    }
    return SizedBox.shrink(); // لا تظهر شيء
  },
)

*/
