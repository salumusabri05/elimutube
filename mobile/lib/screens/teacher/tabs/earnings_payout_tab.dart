import 'package:flutter/material.dart';
import '../../../theme/app_theme.dart';

class EarningsPayoutTab extends StatefulWidget {
  const EarningsPayoutTab({super.key});

  @override
  State<EarningsPayoutTab> createState() => _EarningsPayoutTabState();
}

class _EarningsPayoutTabState extends State<EarningsPayoutTab> {
  bool _isRequesting = false;

  void _requestPayout() async {
    setState(() => _isRequesting = true);
    await Future.delayed(const Duration(seconds: 2));

    if (!mounted) return;
    setState(() => _isRequesting = false);

    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('Malipo yameombwa! Utapokea ndani ya masaa 24. / Payout requested!'),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          // Earnings Overview Card
          Card(
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
            elevation: 2,
            child: Container(
              decoration: BoxDecoration(
                gradient: const LinearGradient(
                  colors: [AppTheme.primary, AppTheme.teal],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                borderRadius: BorderRadius.circular(20),
              ),
              padding: const EdgeInsets.all(24.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'Salio la Sasa / Available Balance',
                    style: TextStyle(color: Colors.white70, fontSize: 13),
                  ),
                  const SizedBox(height: 8),
                  const Text(
                    'Tsh 128,450',
                    style: TextStyle(color: Colors.white, fontSize: 32, fontWeight: FontWeight.bold, letterSpacing: 1),
                  ),
                  const SizedBox(height: 20),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text('Jumla ya Mapato', style: TextStyle(color: Colors.white60, fontSize: 11)),
                          SizedBox(height: 2),
                          Text('Tsh 842,000', style: TextStyle(color: Colors.white, fontSize: 14, fontWeight: FontWeight.bold)),
                        ],
                      ),
                      ElevatedButton(
                        onPressed: _isRequesting ? null : _requestPayout,
                        style: ElevatedButton.styleFrom(
                          backgroundColor: AppTheme.accent,
                          foregroundColor: AppTheme.primary,
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                        ),
                        child: _isRequesting
                            ? const SizedBox(
                                width: 16,
                                height: 16,
                                child: CircularProgressIndicator(strokeWidth: 2, valueColor: AlwaysStoppedAnimation<Color>(AppTheme.primary)),
                              )
                            : const Text('Toa Malipo / Withdraw', style: TextStyle(fontWeight: FontWeight.bold)),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 24),

          // Payout methods status details
          const Text(
            'Njia ya Kupokelea / Settlement Method',
            style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
          ),
          const SizedBox(height: 12),
          Card(
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
            child: const ListTile(
              leading: Icon(Icons.account_balance, color: AppTheme.teal),
              title: Text('Selcom M-Pesa Wallet'),
              subtitle: Text('+255 754 **** 89'),
              trailing: Icon(Icons.check_circle, color: Colors.green),
            ),
          ),
          const SizedBox(height: 24),

          // Payout History
          const Text(
            'Historia ya Malipo / Payout History',
            style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
          ),
          const SizedBox(height: 12),

          ListView.builder(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            itemCount: 3,
            itemBuilder: (context, index) {
              final amounts = ['Tsh 120,000', 'Tsh 240,000', 'Tsh 350,000'];
              final dates = ['Mei 28, 2026', 'Mei 14, 2026', 'Apr 30, 2026'];
              final statuses = ['SETTLED', 'SETTLED', 'SETTLED'];

              return Card(
                margin: const EdgeInsets.only(bottom: 12),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                child: ListTile(
                  leading: const Icon(Icons.arrow_downward, color: Colors.green),
                  title: Text(amounts[index], style: const TextStyle(fontWeight: FontWeight.bold)),
                  subtitle: Text(dates[index]),
                  trailing: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                    decoration: BoxDecoration(
                      color: Colors.green[50],
                      borderRadius: BorderRadius.circular(6),
                    ),
                    child: Text(
                      statuses[index],
                      style: TextStyle(color: Colors.green[800], fontSize: 10, fontWeight: FontWeight.bold),
                    ),
                  ),
                ),
              );
            },
          ),
        ],
      ),
    );
  }
}
