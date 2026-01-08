// GENERATED CODE - DO NOT MODIFY BY HAND
// coverage:ignore-file
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'score_checker_state.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

// dart format off
T _$identity<T>(T value) => value;
/// @nodoc
mixin _$ScoreCheckerState {

 bool get isLoading; String? get error; String? get result; List<int>? get selectedFileBytes; String? get selectedFileName;
/// Create a copy of ScoreCheckerState
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$ScoreCheckerStateCopyWith<ScoreCheckerState> get copyWith => _$ScoreCheckerStateCopyWithImpl<ScoreCheckerState>(this as ScoreCheckerState, _$identity);



@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is ScoreCheckerState&&(identical(other.isLoading, isLoading) || other.isLoading == isLoading)&&(identical(other.error, error) || other.error == error)&&(identical(other.result, result) || other.result == result)&&const DeepCollectionEquality().equals(other.selectedFileBytes, selectedFileBytes)&&(identical(other.selectedFileName, selectedFileName) || other.selectedFileName == selectedFileName));
}


@override
int get hashCode => Object.hash(runtimeType,isLoading,error,result,const DeepCollectionEquality().hash(selectedFileBytes),selectedFileName);

@override
String toString() {
  return 'ScoreCheckerState(isLoading: $isLoading, error: $error, result: $result, selectedFileBytes: $selectedFileBytes, selectedFileName: $selectedFileName)';
}


}

/// @nodoc
abstract mixin class $ScoreCheckerStateCopyWith<$Res>  {
  factory $ScoreCheckerStateCopyWith(ScoreCheckerState value, $Res Function(ScoreCheckerState) _then) = _$ScoreCheckerStateCopyWithImpl;
@useResult
$Res call({
 bool isLoading, String? error, String? result, List<int>? selectedFileBytes, String? selectedFileName
});




}
/// @nodoc
class _$ScoreCheckerStateCopyWithImpl<$Res>
    implements $ScoreCheckerStateCopyWith<$Res> {
  _$ScoreCheckerStateCopyWithImpl(this._self, this._then);

  final ScoreCheckerState _self;
  final $Res Function(ScoreCheckerState) _then;

/// Create a copy of ScoreCheckerState
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? isLoading = null,Object? error = freezed,Object? result = freezed,Object? selectedFileBytes = freezed,Object? selectedFileName = freezed,}) {
  return _then(_self.copyWith(
isLoading: null == isLoading ? _self.isLoading : isLoading // ignore: cast_nullable_to_non_nullable
as bool,error: freezed == error ? _self.error : error // ignore: cast_nullable_to_non_nullable
as String?,result: freezed == result ? _self.result : result // ignore: cast_nullable_to_non_nullable
as String?,selectedFileBytes: freezed == selectedFileBytes ? _self.selectedFileBytes : selectedFileBytes // ignore: cast_nullable_to_non_nullable
as List<int>?,selectedFileName: freezed == selectedFileName ? _self.selectedFileName : selectedFileName // ignore: cast_nullable_to_non_nullable
as String?,
  ));
}

}


/// Adds pattern-matching-related methods to [ScoreCheckerState].
extension ScoreCheckerStatePatterns on ScoreCheckerState {
/// A variant of `map` that fallback to returning `orElse`.
///
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case final Subclass value:
///     return ...;
///   case _:
///     return orElse();
/// }
/// ```

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _ScoreCheckerState value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _ScoreCheckerState() when $default != null:
return $default(_that);case _:
  return orElse();

}
}
/// A `switch`-like method, using callbacks.
///
/// Callbacks receives the raw object, upcasted.
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case final Subclass value:
///     return ...;
///   case final Subclass2 value:
///     return ...;
/// }
/// ```

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _ScoreCheckerState value)  $default,){
final _that = this;
switch (_that) {
case _ScoreCheckerState():
return $default(_that);}
}
/// A variant of `map` that fallback to returning `null`.
///
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case final Subclass value:
///     return ...;
///   case _:
///     return null;
/// }
/// ```

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _ScoreCheckerState value)?  $default,){
final _that = this;
switch (_that) {
case _ScoreCheckerState() when $default != null:
return $default(_that);case _:
  return null;

}
}
/// A variant of `when` that fallback to an `orElse` callback.
///
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case Subclass(:final field):
///     return ...;
///   case _:
///     return orElse();
/// }
/// ```

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( bool isLoading,  String? error,  String? result,  List<int>? selectedFileBytes,  String? selectedFileName)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _ScoreCheckerState() when $default != null:
return $default(_that.isLoading,_that.error,_that.result,_that.selectedFileBytes,_that.selectedFileName);case _:
  return orElse();

}
}
/// A `switch`-like method, using callbacks.
///
/// As opposed to `map`, this offers destructuring.
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case Subclass(:final field):
///     return ...;
///   case Subclass2(:final field2):
///     return ...;
/// }
/// ```

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( bool isLoading,  String? error,  String? result,  List<int>? selectedFileBytes,  String? selectedFileName)  $default,) {final _that = this;
switch (_that) {
case _ScoreCheckerState():
return $default(_that.isLoading,_that.error,_that.result,_that.selectedFileBytes,_that.selectedFileName);}
}
/// A variant of `when` that fallback to returning `null`
///
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case Subclass(:final field):
///     return ...;
///   case _:
///     return null;
/// }
/// ```

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( bool isLoading,  String? error,  String? result,  List<int>? selectedFileBytes,  String? selectedFileName)?  $default,) {final _that = this;
switch (_that) {
case _ScoreCheckerState() when $default != null:
return $default(_that.isLoading,_that.error,_that.result,_that.selectedFileBytes,_that.selectedFileName);case _:
  return null;

}
}

}

/// @nodoc


class _ScoreCheckerState extends ScoreCheckerState {
  const _ScoreCheckerState({this.isLoading = false, this.error, this.result, final  List<int>? selectedFileBytes, this.selectedFileName}): _selectedFileBytes = selectedFileBytes,super._();
  

@override@JsonKey() final  bool isLoading;
@override final  String? error;
@override final  String? result;
 final  List<int>? _selectedFileBytes;
@override List<int>? get selectedFileBytes {
  final value = _selectedFileBytes;
  if (value == null) return null;
  if (_selectedFileBytes is EqualUnmodifiableListView) return _selectedFileBytes;
  // ignore: implicit_dynamic_type
  return EqualUnmodifiableListView(value);
}

@override final  String? selectedFileName;

/// Create a copy of ScoreCheckerState
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$ScoreCheckerStateCopyWith<_ScoreCheckerState> get copyWith => __$ScoreCheckerStateCopyWithImpl<_ScoreCheckerState>(this, _$identity);



@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is _ScoreCheckerState&&(identical(other.isLoading, isLoading) || other.isLoading == isLoading)&&(identical(other.error, error) || other.error == error)&&(identical(other.result, result) || other.result == result)&&const DeepCollectionEquality().equals(other._selectedFileBytes, _selectedFileBytes)&&(identical(other.selectedFileName, selectedFileName) || other.selectedFileName == selectedFileName));
}


@override
int get hashCode => Object.hash(runtimeType,isLoading,error,result,const DeepCollectionEquality().hash(_selectedFileBytes),selectedFileName);

@override
String toString() {
  return 'ScoreCheckerState(isLoading: $isLoading, error: $error, result: $result, selectedFileBytes: $selectedFileBytes, selectedFileName: $selectedFileName)';
}


}

/// @nodoc
abstract mixin class _$ScoreCheckerStateCopyWith<$Res> implements $ScoreCheckerStateCopyWith<$Res> {
  factory _$ScoreCheckerStateCopyWith(_ScoreCheckerState value, $Res Function(_ScoreCheckerState) _then) = __$ScoreCheckerStateCopyWithImpl;
@override @useResult
$Res call({
 bool isLoading, String? error, String? result, List<int>? selectedFileBytes, String? selectedFileName
});




}
/// @nodoc
class __$ScoreCheckerStateCopyWithImpl<$Res>
    implements _$ScoreCheckerStateCopyWith<$Res> {
  __$ScoreCheckerStateCopyWithImpl(this._self, this._then);

  final _ScoreCheckerState _self;
  final $Res Function(_ScoreCheckerState) _then;

/// Create a copy of ScoreCheckerState
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? isLoading = null,Object? error = freezed,Object? result = freezed,Object? selectedFileBytes = freezed,Object? selectedFileName = freezed,}) {
  return _then(_ScoreCheckerState(
isLoading: null == isLoading ? _self.isLoading : isLoading // ignore: cast_nullable_to_non_nullable
as bool,error: freezed == error ? _self.error : error // ignore: cast_nullable_to_non_nullable
as String?,result: freezed == result ? _self.result : result // ignore: cast_nullable_to_non_nullable
as String?,selectedFileBytes: freezed == selectedFileBytes ? _self._selectedFileBytes : selectedFileBytes // ignore: cast_nullable_to_non_nullable
as List<int>?,selectedFileName: freezed == selectedFileName ? _self.selectedFileName : selectedFileName // ignore: cast_nullable_to_non_nullable
as String?,
  ));
}


}

// dart format on
