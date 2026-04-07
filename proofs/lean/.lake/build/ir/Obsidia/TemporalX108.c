// Lean compiler output
// Module: Obsidia.TemporalX108
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
LEAN_EXPORT uint8_t lp_obsidia_x2dengine_x2dproof_x2dcore_Obsidia_decideX108(lean_object*, lean_object*);
LEAN_EXPORT lean_object* lp_obsidia_x2dengine_x2dproof_x2dcore_Obsidia_beforeTau___boxed(lean_object*, lean_object*);
LEAN_EXPORT uint8_t lp_obsidia_x2dengine_x2dproof_x2dcore_Obsidia_decide3X108(lean_object*, lean_object*);
LEAN_EXPORT lean_object* lp_obsidia_x2dengine_x2dproof_x2dcore_Obsidia_elapsed(lean_object*);
uint8_t lp_obsidia_x2dengine_x2dproof_x2dcore_Obsidia_decision(lean_object*, lean_object*);
LEAN_EXPORT lean_object* lp_obsidia_x2dengine_x2dproof_x2dcore_Obsidia_decide3X108___boxed(lean_object*, lean_object*);
LEAN_EXPORT uint8_t lp_obsidia_x2dengine_x2dproof_x2dcore_Obsidia_beforeTau(lean_object*, lean_object*);
uint8_t lp_obsidia_x2dengine_x2dproof_x2dcore_Obsidia_liftDecision(uint8_t);
LEAN_EXPORT lean_object* lp_obsidia_x2dengine_x2dproof_x2dcore_Obsidia_decideX108___boxed(lean_object*, lean_object*);
LEAN_EXPORT lean_object* lp_obsidia_x2dengine_x2dproof_x2dcore_Obsidia_elapsed___boxed(lean_object*);
lean_object* lean_int_sub(lean_object*, lean_object*);
uint8_t lean_int_dec_lt(lean_object*, lean_object*);
LEAN_EXPORT lean_object* lp_obsidia_x2dengine_x2dproof_x2dcore_Obsidia_elapsed(lean_object* x_1) {
_start:
{
lean_object* x_2; lean_object* x_3; lean_object* x_4; 
x_2 = lean_ctor_get(x_1, 2);
x_3 = lean_ctor_get(x_1, 3);
x_4 = lean_int_sub(x_3, x_2);
return x_4;
}
}
LEAN_EXPORT lean_object* lp_obsidia_x2dengine_x2dproof_x2dcore_Obsidia_elapsed___boxed(lean_object* x_1) {
_start:
{
lean_object* x_2; 
x_2 = lp_obsidia_x2dengine_x2dproof_x2dcore_Obsidia_elapsed(x_1);
lean_dec_ref(x_1);
return x_2;
}
}
LEAN_EXPORT uint8_t lp_obsidia_x2dengine_x2dproof_x2dcore_Obsidia_beforeTau(lean_object* x_1, lean_object* x_2) {
_start:
{
uint8_t x_3; 
x_3 = lean_ctor_get_uint8(x_2, sizeof(void*)*4);
if (x_3 == 0)
{
return x_3;
}
else
{
lean_object* x_4; uint8_t x_5; 
x_4 = lp_obsidia_x2dengine_x2dproof_x2dcore_Obsidia_elapsed(x_2);
x_5 = lean_int_dec_lt(x_4, x_1);
lean_dec(x_4);
return x_5;
}
}
}
LEAN_EXPORT lean_object* lp_obsidia_x2dengine_x2dproof_x2dcore_Obsidia_beforeTau___boxed(lean_object* x_1, lean_object* x_2) {
_start:
{
uint8_t x_3; lean_object* x_4; 
x_3 = lp_obsidia_x2dengine_x2dproof_x2dcore_Obsidia_beforeTau(x_1, x_2);
lean_dec_ref(x_2);
lean_dec(x_1);
x_4 = lean_box(x_3);
return x_4;
}
}
LEAN_EXPORT uint8_t lp_obsidia_x2dengine_x2dproof_x2dcore_Obsidia_decideX108(lean_object* x_1, lean_object* x_2) {
_start:
{
uint8_t x_3; 
x_3 = lp_obsidia_x2dengine_x2dproof_x2dcore_Obsidia_beforeTau(x_1, x_2);
if (x_3 == 0)
{
lean_object* x_4; lean_object* x_5; uint8_t x_6; 
x_4 = lean_ctor_get(x_2, 0);
lean_inc_ref(x_4);
x_5 = lean_ctor_get(x_2, 1);
lean_inc_ref(x_5);
lean_dec_ref(x_2);
x_6 = lp_obsidia_x2dengine_x2dproof_x2dcore_Obsidia_decision(x_4, x_5);
return x_6;
}
else
{
uint8_t x_7; 
lean_dec_ref(x_2);
x_7 = 0;
return x_7;
}
}
}
LEAN_EXPORT lean_object* lp_obsidia_x2dengine_x2dproof_x2dcore_Obsidia_decideX108___boxed(lean_object* x_1, lean_object* x_2) {
_start:
{
uint8_t x_3; lean_object* x_4; 
x_3 = lp_obsidia_x2dengine_x2dproof_x2dcore_Obsidia_decideX108(x_1, x_2);
lean_dec(x_1);
x_4 = lean_box(x_3);
return x_4;
}
}
LEAN_EXPORT uint8_t lp_obsidia_x2dengine_x2dproof_x2dcore_Obsidia_decide3X108(lean_object* x_1, lean_object* x_2) {
_start:
{
uint8_t x_3; uint8_t x_4; 
x_3 = lp_obsidia_x2dengine_x2dproof_x2dcore_Obsidia_decideX108(x_1, x_2);
x_4 = lp_obsidia_x2dengine_x2dproof_x2dcore_Obsidia_liftDecision(x_3);
return x_4;
}
}
LEAN_EXPORT lean_object* lp_obsidia_x2dengine_x2dproof_x2dcore_Obsidia_decide3X108___boxed(lean_object* x_1, lean_object* x_2) {
_start:
{
uint8_t x_3; lean_object* x_4; 
x_3 = lp_obsidia_x2dengine_x2dproof_x2dcore_Obsidia_decide3X108(x_1, x_2);
lean_dec(x_1);
x_4 = lean_box(x_3);
return x_4;
}
}
lean_object* initialize_Init(uint8_t builtin);
lean_object* initialize_obsidia_x2dengine_x2dproof_x2dcore_Obsidia_Basic(uint8_t builtin);
static bool _G_initialized = false;
LEAN_EXPORT lean_object* initialize_obsidia_x2dengine_x2dproof_x2dcore_Obsidia_TemporalX108(uint8_t builtin) {
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
