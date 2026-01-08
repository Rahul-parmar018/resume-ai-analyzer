import 'package:flutter/material.dart';
import 'package:file_picker/file_picker.dart';
import 'package:resume_ai_flutter/src/shared/widgets/glass_card.dart';
import 'package:resume_ai_flutter/src/shared/widgets/scroll_animation.dart';
import 'package:resume_ai_flutter/src/shared/widgets/floating_elements.dart';
import 'package:resume_ai_flutter/src/shared/widgets/modal_3d.dart';
import 'package:resume_ai_flutter/src/shared/widgets/data_table_custom.dart';
import 'package:resume_ai_flutter/src/shared/theme/app_theme.dart';

class FinderDetailScreen extends StatefulWidget {
  final String requisitionId;
  final String title;

  const FinderDetailScreen({
    super.key,
    required this.requisitionId,
    required this.title,
  });

  @override
  State<FinderDetailScreen> createState() => _FinderDetailScreenState();
}

class _FinderDetailScreenState extends State<FinderDetailScreen> {
  final List<CandidateRow> _candidates = [];
  final Set<int> _selectedIndices = {};
  bool _selectAll = false;
  int _currentPage = 1;
  final int _pageSize = 10;
  String _minMatchFilter = '';
  String _statusFilter = '';

  @override
  void initState() {
    super.initState();
    // TODO: Load candidates from API
    _loadMockData();
  }

  void _loadMockData() {
    setState(() {
      _candidates.addAll([
        CandidateRow(
          name: 'John Doe',
          contact: 'john@example.com',
          years: 5,
          location: 'San Francisco, CA',
          matchPercent: 85,
          totalScore: 82,
          status: 'Shortlisted',
        ),
        CandidateRow(
          name: 'Jane Smith',
          contact: 'jane@example.com',
          years: 3,
          location: 'Remote',
          matchPercent: 72,
          totalScore: 75,
          status: 'Review',
        ),
      ]);
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.bgPrimary,
      body: Stack(
        children: [
          // Floating background elements
          const FloatingElements(),

          // Main content
          SingleChildScrollView(
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 40),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Header with actions
                  ScrollAnimation(
                    delay: const Duration(milliseconds: 0),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Expanded(
                          child: Text(
                            widget.title,
                            style: AppTheme.display2,
                          ),
                        ),
                        Row(
                          children: [
                            OutlinedButton.icon(
                              onPressed: () => _showRestartModal(context),
                              icon: const Icon(Icons.refresh, size: 18),
                              label: const Text('Restart'),
                              style: OutlinedButton.styleFrom(
                                foregroundColor: AppTheme.danger,
                                side: BorderSide(color: AppTheme.danger),
                              ),
                            ),
                            const SizedBox(width: 8),
                            OutlinedButton(
                              onPressed: () {
                                // TODO: Re-score
                              },
                              style: OutlinedButton.styleFrom(
                                foregroundColor: AppTheme.textPrimary,
                                side: BorderSide(
                                  color: Colors.white.withOpacity(0.25),
                                ),
                              ),
                              child: const Text('Re-score'),
                            ),
                            const SizedBox(width: 8),
                            OutlinedButton.icon(
                              onPressed: () {
                                // TODO: Export CSV
                              },
                              icon: const Icon(Icons.download, size: 18),
                              label: const Text('Export CSV'),
                              style: OutlinedButton.styleFrom(
                                foregroundColor: AppTheme.textPrimary,
                                side: BorderSide(
                                  color: Colors.white.withOpacity(0.25),
                                ),
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),

                  const SizedBox(height: 24),

                  // Summary chips
                  ScrollAnimation(
                    delay: const Duration(milliseconds: 100),
                    child: GlassCard(
                      padding: const EdgeInsets.all(8),
                      child: Wrap(
                        spacing: 8,
                        runSpacing: 8,
                        children: [
                          _Chip(icon: Icons.work, label: widget.title),
                          _Chip(icon: Icons.location_on, label: 'Any'),
                          _Chip(icon: Icons.access_time, label: 'Min exp: 0y'),
                          _Chip(label: 'Must:', isMuted: true),
                          _Chip(label: 'SQL', isKey: true),
                          _Chip(label: 'Python', isKey: true),
                          _Chip(label: 'Nice:', isMuted: true),
                          _Chip(label: 'Tableau', isKeyAlt: true),
                        ],
                      ),
                    ),
                  ),

                  const SizedBox(height: 24),

                  // Requisition form tabs
                  ScrollAnimation(
                    delay: const Duration(milliseconds: 200),
                    child: _RequisitionFormCard(requisitionId: widget.requisitionId),
                  ),

                  const SizedBox(height: 24),

                  // Analyze resumes card
                  ScrollAnimation(
                    delay: const Duration(milliseconds: 300),
                    child: _AnalyzeCard(requisitionId: widget.requisitionId),
                  ),

                  const SizedBox(height: 24),

                  // Filters and Compare
                  ScrollAnimation(
                    delay: const Duration(milliseconds: 400),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Row(
                          children: [
                            SizedBox(
                              width: 140,
                              child: TextField(
                                controller: TextEditingController(text: _minMatchFilter),
                                keyboardType: TextInputType.number,
                                style: AppTheme.bodySmall,
                                decoration: _filterInputDecoration('Min match %'),
                                onChanged: (value) {
                                  setState(() {
                                    _minMatchFilter = value;
                                  });
                                },
                              ),
                            ),
                            const SizedBox(width: 8),
                            SizedBox(
                              width: 180,
                              child: DropdownButtonFormField<String>(
                                value: _statusFilter.isEmpty ? null : _statusFilter,
                                decoration: _filterInputDecoration(null),
                                style: AppTheme.bodySmall,
                                items: const [
                                  DropdownMenuItem(value: '', child: Text('Status: All')),
                                  DropdownMenuItem(value: 'shortlisted', child: Text('Shortlisted')),
                                  DropdownMenuItem(value: 'review', child: Text('Review')),
                                  DropdownMenuItem(value: 'rejected', child: Text('Rejected')),
                                ],
                                onChanged: (value) {
                                  setState(() {
                                    _statusFilter = value ?? '';
                                  });
                                },
                              ),
                            ),
                            const SizedBox(width: 8),
                            OutlinedButton(
                              onPressed: () {
                                // TODO: Apply filters
                              },
                              style: OutlinedButton.styleFrom(
                                foregroundColor: AppTheme.textPrimary,
                                side: BorderSide(
                                  color: Colors.white.withOpacity(0.25),
                                ),
                              ),
                              child: const Text('Apply'),
                            ),
                          ],
                        ),
                        OutlinedButton(
                          onPressed: _selectedIndices.isEmpty
                              ? null
                              : () {
                                  // TODO: Show compare modal
                                },
                          style: OutlinedButton.styleFrom(
                            foregroundColor: AppTheme.textPrimary,
                            side: BorderSide(
                              color: Colors.white.withOpacity(0.25),
                            ),
                          ),
                          child: Text('Compare (${_selectedIndices.length})'),
                        ),
                      ],
                    ),
                  ),

                  const SizedBox(height: 24),

                  // Results table
                  ScrollAnimation(
                    delay: const Duration(milliseconds: 500),
                    child: _ResultsTable(
                      candidates: _candidates,
                      selectedIndices: _selectedIndices,
                      selectAll: _selectAll,
                      onSelectAll: (value) {
                        setState(() {
                          _selectAll = value ?? false;
                          if (_selectAll) {
                            _selectedIndices.addAll(
                              List.generate(_candidates.length, (i) => i),
                            );
                          } else {
                            _selectedIndices.clear();
                          }
                        });
                      },
                      onSelectRow: (index, selected) {
                        setState(() {
                          if (selected) {
                            _selectedIndices.add(index);
                          } else {
                            _selectedIndices.remove(index);
                          }
                        });
                      },
                      onView: (index) {
                        // TODO: Show preview modal
                      },
                      onInsights: (index) {
                        _showInsightsModal(context, _candidates[index]);
                      },
                      onNote: (index) {
                        _showNoteModal(context, _candidates[index]);
                      },
                    ),
                  ),

                  const SizedBox(height: 24),

                  // Pagination
                  _Pagination(
                    currentPage: _currentPage,
                    totalPages: (_candidates.length / _pageSize).ceil(),
                    onPageChanged: (page) {
                      setState(() {
                        _currentPage = page;
                      });
                    },
                  ),

                  const SizedBox(height: 80),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  InputDecoration _filterInputDecoration(String? hint) {
    return InputDecoration(
      hintText: hint,
      hintStyle: TextStyle(color: AppTheme.textMuted, fontSize: 14),
      filled: true,
      fillColor: Colors.white.withOpacity(0.05),
      contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
      border: OutlineInputBorder(
        borderRadius: BorderRadius.circular(8),
        borderSide: BorderSide(
          color: Colors.white.withOpacity(0.16),
        ),
      ),
      enabledBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(8),
        borderSide: BorderSide(
          color: Colors.white.withOpacity(0.16),
        ),
      ),
      focusedBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(8),
        borderSide: BorderSide(
          color: AppTheme.accentPrimary.withOpacity(0.55),
        ),
      ),
    );
  }

  void _showRestartModal(BuildContext context) {
    Modal3D.show(
      context: context,
      title: 'Restart requisition',
      actions: [
        TextButton(
          onPressed: () => Navigator.of(context).pop(),
          child: Text(
            'Cancel',
            style: TextStyle(color: AppTheme.textPrimary),
          ),
        ),
        ElevatedButton(
          onPressed: () {
            // TODO: Implement restart
            Navigator.of(context).pop();
          },
          style: ElevatedButton.styleFrom(
            backgroundColor: AppTheme.danger,
            foregroundColor: Colors.white,
          ),
          child: const Text('Restart now'),
        ),
      ],
      child: Text(
        'This will permanently delete all analyzed candidates and their uploaded files for this requisition. Your requirements (title/skills/min exp/location) will be kept.',
        style: AppTheme.body.copyWith(color: AppTheme.textMuted),
      ),
    );
  }

  void _showInsightsModal(BuildContext context, CandidateRow candidate) {
    Modal3D.show(
      context: context,
      title: 'Candidate Insights',
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Match Score: ${candidate.matchPercent}%',
            style: AppTheme.heading3,
          ),
          const SizedBox(height: 16),
          Text(
            'Total Score: ${candidate.totalScore}',
            style: AppTheme.body,
          ),
          // TODO: Add more insights
        ],
      ),
    );
  }

  void _showNoteModal(BuildContext context, CandidateRow candidate) {
    final noteController = TextEditingController();
    Modal3D.show(
      context: context,
      title: 'Add/Update Note',
      actions: [
        TextButton(
          onPressed: () => Navigator.of(context).pop(),
          child: Text(
            'Cancel',
            style: TextStyle(color: AppTheme.textPrimary),
          ),
        ),
        ElevatedButton(
          onPressed: () {
            // TODO: Save note
            Navigator.of(context).pop();
          },
          style: ElevatedButton.styleFrom(
            backgroundColor: AppTheme.brandPrimary,
            foregroundColor: Colors.white,
          ),
          child: const Text('Save'),
        ),
      ],
      child: TextField(
        controller: noteController,
        maxLines: 4,
        style: AppTheme.body,
        decoration: InputDecoration(
          hintText: 'Write a note...',
          hintStyle: TextStyle(color: AppTheme.textMuted),
          filled: true,
          fillColor: Colors.white.withOpacity(0.05),
          border: OutlineInputBorder(
            borderRadius: BorderRadius.circular(10),
            borderSide: BorderSide(
              color: Colors.white.withOpacity(0.16),
            ),
          ),
          enabledBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(10),
            borderSide: BorderSide(
              color: Colors.white.withOpacity(0.16),
            ),
          ),
          focusedBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(10),
            borderSide: BorderSide(
              color: AppTheme.accentPrimary.withOpacity(0.55),
              width: 2,
            ),
          ),
        ),
      ),
    );
  }
}

class CandidateRow {
  final String name;
  final String contact;
  final int years;
  final String location;
  final int matchPercent;
  final int totalScore;
  final String status;

  CandidateRow({
    required this.name,
    required this.contact,
    required this.years,
    required this.location,
    required this.matchPercent,
    required this.totalScore,
    required this.status,
  });
}

class _Chip extends StatelessWidget {
  final IconData? icon;
  final String label;
  final bool isMuted;
  final bool isKey;
  final bool isKeyAlt;

  const _Chip({
    this.icon,
    required this.label,
    this.isMuted = false,
    this.isKey = false,
    this.isKeyAlt = false,
  });

  @override
  Widget build(BuildContext context) {
    Color backgroundColor;
    Color textColor;

    if (isMuted) {
      backgroundColor = Colors.white.withOpacity(0.08);
      textColor = AppTheme.textMuted;
    } else if (isKey) {
      backgroundColor = AppTheme.brandSecondary.withOpacity(0.2);
      textColor = AppTheme.brandSecondary;
    } else if (isKeyAlt) {
      backgroundColor = AppTheme.accentPrimary.withOpacity(0.2);
      textColor = AppTheme.accentPrimary;
    } else {
      backgroundColor = Colors.white.withOpacity(0.08);
      textColor = AppTheme.textPrimary;
    }

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
      decoration: BoxDecoration(
        color: backgroundColor,
        borderRadius: BorderRadius.circular(8),
        border: Border.all(
          color: Colors.white.withOpacity(0.10),
        ),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          if (icon != null) ...[
            Icon(icon, size: 14, color: textColor),
            const SizedBox(width: 4),
          ],
          Text(
            label,
            style: AppTheme.bodySmall.copyWith(color: textColor),
          ),
        ],
      ),
    );
  }
}

class _RequisitionFormCard extends StatefulWidget {
  final String requisitionId;

  const _RequisitionFormCard({required this.requisitionId});

  @override
  State<_RequisitionFormCard> createState() => _RequisitionFormCardState();
}

class _RequisitionFormCardState extends State<_RequisitionFormCard>
    with SingleTickerProviderStateMixin {
  late TabController _tabController;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 2, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return GlassCard(
      padding: const EdgeInsets.all(12),
      child: Column(
        children: [
          TabBar(
            controller: _tabController,
            labelColor: AppTheme.textPrimary,
            unselectedLabelColor: AppTheme.textMuted,
            indicatorColor: AppTheme.brandPrimary,
            tabs: const [
              Tab(text: 'Form'),
              Tab(text: 'Paste JSON'),
            ],
          ),
          SizedBox(
            height: 300,
            child: TabBarView(
              controller: _tabController,
              children: [
                _FormTab(),
                _JsonTab(),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _FormTab extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(8),
      child: Column(
        children: [
          // TODO: Add form fields
          const Spacer(),
          Align(
            alignment: Alignment.centerRight,
            child: ElevatedButton(
              onPressed: () {
                // TODO: Save
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: AppTheme.brandPrimary,
                foregroundColor: Colors.white,
              ),
              child: const Text('Save'),
            ),
          ),
        ],
      ),
    );
  }
}

class _JsonTab extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(8),
      child: Column(
        children: [
          Expanded(
            child: TextField(
              maxLines: 6,
              style: AppTheme.body.copyWith(
                fontFamily: 'monospace',
              ),
              decoration: InputDecoration(
                hintText: '{"title":"Data Analyst","must_have":["SQL","Python"]...}',
                hintStyle: TextStyle(color: AppTheme.textMuted),
                filled: true,
                fillColor: Colors.white.withOpacity(0.05),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(10),
                  borderSide: BorderSide(
                    color: Colors.white.withOpacity(0.16),
                  ),
                ),
              ),
            ),
          ),
          const SizedBox(height: 8),
          Align(
            alignment: Alignment.centerRight,
            child: OutlinedButton(
              onPressed: () {
                // TODO: Apply JSON
              },
              style: OutlinedButton.styleFrom(
                foregroundColor: AppTheme.textPrimary,
                side: BorderSide(
                  color: Colors.white.withOpacity(0.25),
                ),
              ),
              child: const Text('Apply JSON'),
            ),
          ),
        ],
      ),
    );
  }
}

class _AnalyzeCard extends StatefulWidget {
  final String requisitionId;

  const _AnalyzeCard({required this.requisitionId});

  @override
  State<_AnalyzeCard> createState() => _AnalyzeCardState();
}

class _AnalyzeCardState extends State<_AnalyzeCard> {
  List<String> _selectedFiles = [];
  bool _isAnalyzing = false;

  Future<void> _pickFiles() async {
    final result = await FilePicker.platform.pickFiles(
      type: FileType.custom,
      allowedExtensions: ['pdf', 'docx', 'doc'],
      allowMultiple: true,
    );

    if (result != null) {
      setState(() {
        _selectedFiles = result.files.map((f) => f.name).toList();
      });
    }
  }

  Future<void> _analyze() async {
    if (_selectedFiles.isEmpty) return;

    setState(() {
      _isAnalyzing = true;
    });

    // TODO: Implement analyze API call
    await Future.delayed(const Duration(seconds: 2));

    setState(() {
      _isAnalyzing = false;
      _selectedFiles.clear();
    });
  }

  @override
  Widget build(BuildContext context) {
    return GlassCard(
      padding: const EdgeInsets.all(12),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Row(
                children: [
                  const Icon(Icons.upload, color: AppTheme.textPrimary, size: 18),
                  const SizedBox(width: 8),
                  Text(
                    'Analyze resumes',
                    style: AppTheme.heading3,
                  ),
                ],
              ),
              Text(
                'PDF/DOCX',
                style: AppTheme.bodySmall.copyWith(color: AppTheme.textMuted),
              ),
            ],
          ),
          const SizedBox(height: 12),
          OutlinedButton(
            onPressed: _pickFiles,
            style: OutlinedButton.styleFrom(
              foregroundColor: AppTheme.textPrimary,
              side: BorderSide(
                color: Colors.white.withOpacity(0.16),
              ),
            ),
            child: const Text('Select Files'),
          ),
          if (_selectedFiles.isNotEmpty) ...[
            const SizedBox(height: 12),
            ..._selectedFiles.map((file) => Padding(
                  padding: const EdgeInsets.only(bottom: 4),
                  child: Text(
                    file,
                    style: AppTheme.bodySmall,
                  ),
                )),
          ],
          const SizedBox(height: 12),
          Align(
            alignment: Alignment.centerRight,
            child: ElevatedButton(
              onPressed: _selectedFiles.isEmpty || _isAnalyzing ? null : _analyze,
              style: ElevatedButton.styleFrom(
                backgroundColor: AppTheme.brandPrimary,
                foregroundColor: Colors.white,
              ),
              child: _isAnalyzing
                  ? const SizedBox(
                      width: 20,
                      height: 20,
                      child: CircularProgressIndicator(
                        strokeWidth: 2,
                        valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
                      ),
                    )
                  : const Text('Analyze'),
            ),
          ),
          const SizedBox(height: 8),
          Text(
            'Synchronous analyze; uploads are stored under media/resumes/${widget.requisitionId}/.',
            style: AppTheme.bodySmall.copyWith(color: AppTheme.textMuted),
          ),
        ],
      ),
    );
  }
}

class _ResultsTable extends StatelessWidget {
  final List<CandidateRow> candidates;
  final Set<int> selectedIndices;
  final bool selectAll;
  final ValueChanged<bool?> onSelectAll;
  final ValueChanged<int> onSelectRow;
  final ValueChanged<int> onView;
  final ValueChanged<int> onInsights;
  final ValueChanged<int> onNote;

  const _ResultsTable({
    required this.candidates,
    required this.selectedIndices,
    required this.selectAll,
    required this.onSelectAll,
    required this.onSelectRow,
    required this.onView,
    required this.onInsights,
    required this.onNote,
  });

  @override
  Widget build(BuildContext context) {
    if (candidates.isEmpty) {
      return GlassCard(
        padding: const EdgeInsets.all(24),
        child: Center(
          child: Text(
            'No results yet.',
            style: AppTheme.body.copyWith(color: AppTheme.textMuted),
          ),
        ),
      );
    }

    return GlassCard(
      padding: const EdgeInsets.all(8),
      child: DataTableCustom(
        showCheckboxColumn: true,
        onSelectAll: onSelectAll,
        columns: const [
          DataColumn(label: Text('Candidate')),
          DataColumn(label: Text('Contact')),
          DataColumn(label: Text('Years')),
          DataColumn(label: Text('Location')),
          DataColumn(label: Text('Match %')),
          DataColumn(label: Text('Total')),
          DataColumn(label: Text('Status')),
          DataColumn(label: Text('Actions')),
        ],
        rows: List.generate(
          candidates.length,
          (index) {
            final candidate = candidates[index];
            final isSelected = selectedIndices.contains(index);
            return DataRow(
              selected: isSelected,
              onSelectChanged: (selected) => onSelectRow(index, selected ?? false),
              cells: [
                DataCell(Text(candidate.name)),
                DataCell(Text(candidate.contact)),
                DataCell(Text('${candidate.years}')),
                DataCell(Text(candidate.location)),
                DataCell(Text('${candidate.matchPercent}%')),
                DataCell(Text('${candidate.totalScore}')),
                DataCell(Text(candidate.status)),
                DataCell(
                  Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      IconButton(
                        icon: const Icon(Icons.visibility, size: 18),
                        onPressed: () => onView(index),
                        color: AppTheme.textPrimary,
                      ),
                      IconButton(
                        icon: const Icon(Icons.lightbulb, size: 18),
                        onPressed: () => onInsights(index),
                        color: AppTheme.textPrimary,
                      ),
                      IconButton(
                        icon: const Icon(Icons.note, size: 18),
                        onPressed: () => onNote(index),
                        color: AppTheme.textPrimary,
                      ),
                    ],
                  ),
                ),
              ],
            );
          },
        ),
      ),
    );
  }
}

class _Pagination extends StatelessWidget {
  final int currentPage;
  final int totalPages;
  final ValueChanged<int> onPageChanged;

  const _Pagination({
    required this.currentPage,
    required this.totalPages,
    required this.onPageChanged,
  });

  @override
  Widget build(BuildContext context) {
    if (totalPages <= 1) return const SizedBox.shrink();

    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(
          'Page $currentPage of $totalPages',
          style: AppTheme.bodySmall.copyWith(color: AppTheme.textMuted),
        ),
        Row(
          children: [
            if (currentPage > 1)
              IconButton(
                icon: const Icon(Icons.chevron_left),
                onPressed: () => onPageChanged(currentPage - 1),
                color: AppTheme.textPrimary,
              ),
            if (currentPage < totalPages)
              IconButton(
                icon: const Icon(Icons.chevron_right),
                onPressed: () => onPageChanged(currentPage + 1),
                color: AppTheme.textPrimary,
              ),
          ],
        ),
      ],
    );
  }
}

