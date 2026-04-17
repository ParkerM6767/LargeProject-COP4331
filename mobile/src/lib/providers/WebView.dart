import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:webview_flutter/webview_flutter.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();

  // Allow drawing behind system bars for a truly full-screen map experience
  SystemChrome.setEnabledSystemUIMode(SystemUiMode.edgeToEdge);
  SystemChrome.setSystemUIOverlayStyle(const SystemUiOverlayStyle(
    statusBarColor: Colors.transparent,
    systemNavigationBarColor: Colors.transparent,
  ));

  runApp(const SoraclApp());
}

class SoraclApp extends StatelessWidget {
  const SoraclApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'soracl',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: const Color(0xFF86EFAC)),
        useMaterial3: true,
      ),
      home: const SoraclWebView(),
    );
  }
}

class SoraclWebView extends StatefulWidget {
  const SoraclWebView({super.key});

  @override
  State<SoraclWebView> createState() => _SoraclWebViewState();
}

class _SoraclWebViewState extends State<SoraclWebView> {
  late final WebViewController _controller;

  bool _isLoading = true;
  bool _hasError = false;
  int _loadingProgress = 0;

  static const String _url = 'http://soracl.lamay.systems/';

  @override
  void initState() {
    super.initState();
    _initWebView();
  }

  void _initWebView() {
    _controller = WebViewController(
      onPermissionRequest: (WebViewPermissionRequest request) {
        // Grant all permission requests (e.g. geolocation)
        request.grant();
      },
    )
      ..setJavaScriptMode(JavaScriptMode.unrestricted)
      ..setUserAgent('soracl/1.0')

      // Allow geolocation prompts to reach the browser
      ..setOnConsoleMessage((msg) => debugPrint('[WebView] ${msg.message}'))

      ..setNavigationDelegate(
        NavigationDelegate(
          onPageStarted: (_) {
            setState(() {
              _isLoading = true;
              _hasError = false;
              _loadingProgress = 0;
            });
          },
          onProgress: (progress) {
            setState(() => _loadingProgress = progress);
          },
          onPageFinished: (_) {
            setState(() => _isLoading = false);
          },
          onWebResourceError: (error) {
            // Ignore sub-resource errors (fonts, etc.) — only surface main-frame failures
            if (error.isForMainFrame ?? false) {
              setState(() {
                _isLoading = false;
                _hasError = true;
              });
            }
          },
        ),
      )
      ..loadRequest(Uri.parse(_url));
  }

  Future<void> _reload() async {
    setState(() {
      _hasError = false;
      _isLoading = true;
    });
    await _controller.reload();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.black,
      body: SafeArea(
        // Let the map extend under status bar
        top: false,
        bottom: false,
        child: Stack(
          children: [
  
            WebViewWidget(controller: _controller),


            if (_isLoading && _loadingProgress < 100)
              Positioned(
                top: 0,
                left: 0,
                right: 0,
                child: LinearProgressIndicator(
                  value: _loadingProgress / 100,
                  minHeight: 3,
                  backgroundColor: Colors.transparent,
                  color: const Color(0xFF86EFAC),
                ),
              ),

            if (_hasError)
              _ErrorScreen(url: _url, onRetry: _reload),
          ],
        ),
      ),
    );
  }
}

class _ErrorScreen extends StatelessWidget {
  const _ErrorScreen({required this.url, required this.onRetry});

  final String url;
  final VoidCallback onRetry;

  @override
  Widget build(BuildContext context) {
    return Container(
      color: const Color(0xFF0A0F1A),
      child: Center(
        child: Padding(
          padding: const EdgeInsets.all(32),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              // Eye icon (matches soracl branding)
              Container(
                width: 72,
                height: 72,
                decoration: BoxDecoration(
                  color: const Color(0xFF1E293B),
                  borderRadius: BorderRadius.circular(20),
                ),
                child: const Icon(
                  Icons.remove_red_eye_outlined,
                  color: Color(0xFF86EFAC),
                  size: 32,
                ),
              ),
              const SizedBox(height: 24),
              const Text(
                'soracl',
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 22,
                  fontWeight: FontWeight.bold,
                  letterSpacing: -0.5,
                ),
              ),
              const SizedBox(height: 8),
              Text(
                'Could not connect to\n$url',
                textAlign: TextAlign.center,
                style: const TextStyle(
                  color: Color(0xFF64748B),
                  fontSize: 14,
                  height: 1.5,
                ),
              ),
              const SizedBox(height: 8),
              const Text(
                'Make sure the server is running:\nnpm run dev',
                textAlign: TextAlign.center,
                style: TextStyle(
                  color: Color(0xFF334155),
                  fontSize: 12,
                  fontFamily: 'monospace',
                  height: 1.6,
                ),
              ),
              const SizedBox(height: 32),
              FilledButton.icon(
                onPressed: onRetry,
                icon: const Icon(Icons.refresh_rounded, size: 18),
                label: const Text('Retry'),
                style: FilledButton.styleFrom(
                  backgroundColor: const Color(0xFF86EFAC),
                  foregroundColor: const Color(0xFF0A0F1A),
                  padding: const EdgeInsets.symmetric(horizontal: 28, vertical: 14),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(14),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}