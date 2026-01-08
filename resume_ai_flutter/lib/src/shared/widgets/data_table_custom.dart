import 'package:flutter/material.dart';
import 'package:resume_ai_flutter/src/shared/theme/app_theme.dart';

/// Custom data table matching Django CSS exactly
/// CSS: #resultsTable with sticky header and hover effects
class DataTableCustom extends StatelessWidget {
  final List<DataColumn> columns;
  final List<DataRow> rows;
  final bool showCheckboxColumn;
  final ValueChanged<bool?>? onSelectAll;

  const DataTableCustom({
    super.key,
    required this.columns,
    required this.rows,
    this.showCheckboxColumn = false,
    this.onSelectAll,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.08),
        borderRadius: BorderRadius.circular(8),
      ),
      child: SingleChildScrollView(
        scrollDirection: Axis.horizontal,
        child: DataTable(
          headingRowColor: WidgetStateProperty.all(
            Colors.white.withOpacity(0.08),
          ),
          dataRowColor: WidgetStateProperty.resolveWith((states) {
            if (states.contains(WidgetState.hovered)) {
              return Colors.white.withOpacity(0.04);
            }
            return null;
          }),
          columns: [
            if (showCheckboxColumn)
              DataColumn(
                label: Checkbox(
                  value: false, // TODO: Implement select all logic
                  onChanged: onSelectAll,
                ),
              ),
            ...columns,
          ],
          rows: rows,
          headingTextStyle: AppTheme.body.copyWith(
            color: AppTheme.textPrimary,
            fontWeight: FontWeight.w600,
          ),
          dataTextStyle: AppTheme.body.copyWith(
            color: AppTheme.textPrimary,
          ),
        ),
      ),
    );
  }
}

