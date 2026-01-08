import 'package:flutter/material.dart';
import 'package:resume_ai_flutter/src/shared/theme/app_theme.dart';

/// Quest list with checkboxes matching Django CSS exactly
/// CSS: .quest-list with hover effects and completed state
class QuestList extends StatefulWidget {
  final List<QuestItem> items;

  const QuestList({
    super.key,
    required this.items,
  });

  @override
  State<QuestList> createState() => _QuestListState();
}

class _QuestListState extends State<QuestList> {
  final Set<int> _completedItems = {};

  void _toggleItem(int index) {
    setState(() {
      if (_completedItems.contains(index)) {
        _completedItems.remove(index);
      } else {
        _completedItems.add(index);
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: List.generate(
        widget.items.length,
        (index) => _QuestItemWidget(
          item: widget.items[index],
          isCompleted: _completedItems.contains(index),
          onTap: () => _toggleItem(index),
        ),
      ),
    );
  }
}

class QuestItem {
  final String text;

  QuestItem({required this.text});
}

class _QuestItemWidget extends StatefulWidget {
  final QuestItem item;
  final bool isCompleted;
  final VoidCallback onTap;

  const _QuestItemWidget({
    required this.item,
    required this.isCompleted,
    required this.onTap,
  });

  @override
  State<_QuestItemWidget> createState() => _QuestItemWidgetState();
}

class _QuestItemWidgetState extends State<_QuestItemWidget> {
  bool _isHovered = false;

  @override
  Widget build(BuildContext context) {
    return MouseRegion(
      onEnter: (_) => setState(() => _isHovered = true),
      onExit: (_) => setState(() => _isHovered = false),
      child: GestureDetector(
        onTap: widget.onTap,
        child: AnimatedContainer(
          duration: const Duration(milliseconds: 300),
          margin: const EdgeInsets.only(bottom: 12),
          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
          decoration: BoxDecoration(
            color: widget.isCompleted
                ? AppTheme.brandSecondary.withOpacity(0.1)
                : const Color(0xFF1e232d).withOpacity(0.3),
            borderRadius: BorderRadius.circular(8),
          ),
          transform: Matrix4.identity()
            ..translate(_isHovered ? 4.0 : 0.0, 0.0),
          child: Row(
            children: [
              SizedBox(
                width: 18,
                height: 18,
                child: Checkbox(
                  value: widget.isCompleted,
                  onChanged: (_) => widget.onTap(),
                  activeColor: AppTheme.brandSecondary,
                  checkColor: Colors.white,
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Text(
                  widget.item.text,
                  style: AppTheme.body.copyWith(
                    fontSize: 17.6, // 1.1rem
                    color: widget.isCompleted
                        ? AppTheme.brandSecondary
                        : AppTheme.textPrimary,
                    decoration: widget.isCompleted
                        ? TextDecoration.lineThrough
                        : TextDecoration.none,
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

