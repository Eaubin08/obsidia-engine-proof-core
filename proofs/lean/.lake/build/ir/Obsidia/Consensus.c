// Lean compiler output
// Module: Obsidia.Consensus
// Imports: public import Init public import Obsidia.Basic
#include <lean/lean.h>
#if defined(__clang__)
#pragma clang diagnostic ignored "-Wunused-parameter"
#pragma clang diagnostic ignored "-Wunused-label"
#elif defined(__GNUC__) && !defined(__CLANG__)
#pragma GCC diagnostic ignored "-Wunused-parameter"
#pragma GCC diagnostic ignored "-Wunused-label"
#pragma GCC diagnostic ignored "-Wunused-but-set-variable"
#endif
#ifdef __cplusplus
extern "C" {
#endif
LEAN_EXPORT uint8_t lp_obsidia_x2dengine_x2dproof_x2dcore_Obsidia_aggregate4(uint8_t, uint8_t, uint8_t, uint8_t);
LEAN_EXPORT lean_object* lp_obsidia_x2dengine_x2dproof_x2dcore_List_foldl___at___00Obsidia_countDec_spec__0___boxed(lean_object*, lean_object*, lean_object*);
uint8_t lp_obsidia_x2dengine_x2dproof_x2dcore_Obsidia_instDecidableEqDecision3(uint8_t, uint8_t);
LEAN_EXPORT lean_object* lp_obsidia_x2dengine_x2dproof_x2dcore_Obsidia_countDec(uint8_t, lean_object*);
LEAN_EXPORT lean_object* lp_obsidia_x2dengine_x2dproof_x2dcore_Obsidia_countDec___boxed(lean_object*, lean_object*);
LEAN_EXPORT lean_object* lp_obsidia_x2dengine_x2dproof_x2dcore_List_foldl___at___00Obsidia_countDec_spec__0(uint8_t, lean_object*, lean_object*);
LEAN_EXPORT lean_object* lp_obsidia_x2dengine_x2dproof_x2dcore_Obsidia_aggregate4___boxed(lean_object*, lean_object*, lean_object*, lean_object*);
uint8_t lean_nat_dec_le(lean_object*, lean_object*);
lean_object* lean_nat_add(lean_object*, lean_object*);
LEAN_EXPORT lean_object* lp_obsidia_x2dengine_x2dproof_x2dcore_List_foldl___at___00Obsidia_countDec_spec__0(uint8_t x_1, lean_object* x_2, lean_object* x_3) {
_start:
{
if (lean_obj_tag(x_3) == 0)
{
return x_2;
}
else
{
lean_object* x_4; lean_object* x_5; uint8_t x_6; uint8_t x_7; 
x_4 = lean_ctor_get(x_3, 0);
x_5 = lean_ctor_get(x_3, 1);
x_6 = lean_unbox(x_4);
x_7 = lp_obsidia_x2dengine_x2dproof_x2dcore_Obsidia_instDecidableEqDecision3(x_6, x_1);
if (x_7 == 0)
{
x_3 = x_5;
goto _start;
}
else
{
lean_object* x_9; lean_object* x_10; 
x_9 = lean_unsigned_to_nat(1u);
x_10 = lean_nat_add(x_2, x_9);
lean_dec(x_2);
x_2 = x_10;
x_3 = x_5;
goto _start;
}
}
}
}
LEAN_EXPORT lean_object* lp_obsidia_x2dengine_x2dproof_x2dcore_List_foldl___at___00Obsidia_countDec_spec__0___boxed(lean_object* x_1, lean_object* x_2, lean_object* x_3) {
_start:
{
uint8_t x_4; lean_object* x_5; 
x_4 = lean_unbox(x_1);
x_5 = lp_obsidia_x2dengine_x2dproof_x2dcore_List_foldl___at___00Obsidia_countDec_spec__0(x_4, x_2, x_3);
lean_dec(x_3);
return x_5;
}
}
LEAN_EXPORT lean_object* lp_obsidia_x2dengine_x2dproof_x2dcore_Obsidia_countDec(uint8_t x_1, lean_object* x_2) {
_start:
{
lean_object* x_3; lean_object* x_4; 
x_3 = lean_unsigned_to_nat(0u);
x_4 = lp_obsidia_x2dengine_x2dproof_x2dcore_List_foldl___at___00Obsidia_countDec_spec__0(x_1, x_3, x_2);
return x_4;
}
}
LEAN_EXPORT lean_object* lp_obsidia_x2dengine_x2dproof_x2dcore_Obsidia_countDec___boxed(lean_object* x_1, lean_object* x_2) {
_start:
{
uint8_t x_3; lean_object* x_4; 
x_3 = lean_unbox(x_1);
x_4 = lp_obsidia_x2dengine_x2dproof_x2dcore_Obsidia_countDec(x_3, x_2);
lean_dec(x_2);
return x_4;
}
}
LEAN_EXPORT uint8_t lp_obsidia_x2dengine_x2dproof_x2dcore_Obsidia_aggregate4(uint8_t x_1, uint8_t x_2, uint8_t x_3, uint8_t x_4) {
_start:
{
lean_object* x_5; uint8_t x_6; lean_object* x_7; lean_object* x_8; lean_object* x_9; lean_object* x_10; lean_object* x_11; lean_object* x_12; lean_object* x_13; lean_object* x_14; lean_object* x_15; lean_object* x_16; uint8_t x_17; 
x_5 = lean_unsigned_to_nat(3u);
x_6 = 2;
x_7 = lean_box(0);
x_8 = lean_box(x_4);
x_9 = lean_alloc_ctor(1, 2, 0);
lean_ctor_set(x_9, 0, x_8);
lean_ctor_set(x_9, 1, x_7);
x_10 = lean_box(x_3);
x_11 = lean_alloc_ctor(1, 2, 0);
lean_ctor_set(x_11, 0, x_10);
lean_ctor_set(x_11, 1, x_9);
x_12 = lean_box(x_2);
x_13 = lean_alloc_ctor(1, 2, 0);
lean_ctor_set(x_13, 0, x_12);
lean_ctor_set(x_13, 1, x_11);
x_14 = lean_box(x_1);
x_15 = lean_alloc_ctor(1, 2, 0);
lean_ctor_set(x_15, 0, x_14);
lean_ctor_set(x_15, 1, x_13);
x_16 = lp_obsidia_x2dengine_x2dproof_x2dcore_Obsidia_countDec(x_6, x_15);
x_17 = lean_nat_dec_le(x_5, x_16);
lean_dec(x_16);
if (x_17 == 0)
{
uint8_t x_18; lean_object* x_19; uint8_t x_20; 
x_18 = 1;
x_19 = lp_obsidia_x2dengine_x2dproof_x2dcore_Obsidia_countDec(x_18, x_15);
lean_dec_ref(x_15);
x_20 = lean_nat_dec_le(x_5, x_19);
lean_dec(x_19);
if (x_20 == 0)
{
uint8_t x_21; 
x_21 = 0;
return x_21;
}
else
{
return x_18;
}
}
else
{
lean_dec_ref(x_15);
return x_6;
}
}
}
LEAN_EXPORT lean_object* lp_obsidia_x2dengine_x2dproof_x2dcore_Obsidia_aggregate4___boxed(lean_object* x_1, lean_object* x_2, lean_object* x_3, lean_object* x_4) {
_start:
{
uint8_t x_5; uint8_t x_6; uint8_t x_7; uint8_t x_8; uint8_t x_9; lean_object* x_10; 
x_5 = lean_unbox(x_1);
x_6 = lean_unbox(x_2);
x_7 = lean_unbox(x_3);
x_8 = lean_unbox(x_4);
x_9 = lp_obsidia_x2dengine_x2dproof_x2dcore_Obsidia_aggregate4(x_5, x_6, x_7, x_8);
x_10 = lean_box(x_9);
return x_10;
}
}
lean_object* initialize_Init(uint8_t builtin);
lean_object* initialize_obsidia_x2dengine_x2dproof_x2dcore_Obsidia_Basic(uint8_t builtin);
static bool _G_initialized = false;
LEAN_EXPORT lean_object* initialize_obsidia_x2dengine_x2dproof_x2dcore_Obsidia_Consensus(uint8_t builtin) {
lean_object * res;
if (_G_initialized) return lean_io_result_mk_ok(lean_box(0));
_G_initialized = true;
res = initialize_Init(builtin);
if (lean_io_result_is_error(res)) return res;
lean_dec_ref(res);
res = initialize_obsidia_x2dengine_x2dproof_x2dcore_Obsidia_Basic(builtin);
if (lean_io_result_is_error(res)) return res;
lean_dec_ref(res);
return lean_io_result_mk_ok(lean_box(0));
}
#ifdef __cplusplus
}
#endif
