// Lean compiler output
// Module: Obsidia.Sensitivity
// Imports: public import Init public import Obsidia.Merkle public import Obsidia.CryptoAssumptions
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
lean_object* lean_mk_empty_array_with_capacity(lean_object*);
extern lean_object* lp_obsidia_x2dengine_x2dproof_x2dcore_Obsidia_neutralHash;
lean_object* lp_obsidia_x2dengine_x2dproof_x2dcore_List_foldl___at___00Obsidia_SealAssumptions_combine_spec__0(lean_object*, lean_object*);
LEAN_EXPORT lean_object* lp_obsidia_x2dengine_x2dproof_x2dcore_Obsidia_Sensitivity_updateFile(lean_object*, lean_object*, lean_object*);
lean_object* l___private_Init_Data_List_Impl_0__List_setTR_go___redArg(lean_object*, lean_object*, lean_object*, lean_object*, lean_object*);
static lean_object* lp_obsidia_x2dengine_x2dproof_x2dcore_Obsidia_Sensitivity_updateFile___closed__0;
LEAN_EXPORT lean_object* lp_obsidia_x2dengine_x2dproof_x2dcore_Obsidia_Sensitivity_merkleRoot(lean_object*);
LEAN_EXPORT lean_object* lp_obsidia_x2dengine_x2dproof_x2dcore_Obsidia_Sensitivity_globalSeal(lean_object*, lean_object*);
static lean_object* _init_lp_obsidia_x2dengine_x2dproof_x2dcore_Obsidia_Sensitivity_updateFile___closed__0() {
_start:
{
lean_object* x_1; lean_object* x_2; 
x_1 = lean_unsigned_to_nat(0u);
x_2 = lean_mk_empty_array_with_capacity(x_1);
return x_2;
}
}
LEAN_EXPORT lean_object* lp_obsidia_x2dengine_x2dproof_x2dcore_Obsidia_Sensitivity_updateFile(lean_object* x_1, lean_object* x_2, lean_object* x_3) {
_start:
{
lean_object* x_4; lean_object* x_5; 
x_4 = lp_obsidia_x2dengine_x2dproof_x2dcore_Obsidia_Sensitivity_updateFile___closed__0;
lean_inc(x_3);
x_5 = l___private_Init_Data_List_Impl_0__List_setTR_go___redArg(x_3, x_2, x_3, x_1, x_4);
lean_dec(x_3);
return x_5;
}
}
LEAN_EXPORT lean_object* lp_obsidia_x2dengine_x2dproof_x2dcore_Obsidia_Sensitivity_merkleRoot(lean_object* x_1) {
_start:
{
lean_object* x_2; lean_object* x_3; 
x_2 = lp_obsidia_x2dengine_x2dproof_x2dcore_Obsidia_neutralHash;
x_3 = lp_obsidia_x2dengine_x2dproof_x2dcore_List_foldl___at___00Obsidia_SealAssumptions_combine_spec__0(x_2, x_1);
return x_3;
}
}
LEAN_EXPORT lean_object* lp_obsidia_x2dengine_x2dproof_x2dcore_Obsidia_Sensitivity_globalSeal(lean_object* x_1, lean_object* x_2) {
_start:
{
lean_object* x_3; 
x_3 = lean_alloc_ctor(1, 2, 0);
lean_ctor_set(x_3, 0, x_1);
lean_ctor_set(x_3, 1, x_2);
return x_3;
}
}
lean_object* initialize_Init(uint8_t builtin);
lean_object* initialize_obsidia_x2dengine_x2dproof_x2dcore_Obsidia_Merkle(uint8_t builtin);
lean_object* initialize_obsidia_x2dengine_x2dproof_x2dcore_Obsidia_CryptoAssumptions(uint8_t builtin);
static bool _G_initialized = false;
LEAN_EXPORT lean_object* initialize_obsidia_x2dengine_x2dproof_x2dcore_Obsidia_Sensitivity(uint8_t builtin) {
lean_object * res;
if (_G_initialized) return lean_io_result_mk_ok(lean_box(0));
_G_initialized = true;
res = initialize_Init(builtin);
if (lean_io_result_is_error(res)) return res;
lean_dec_ref(res);
res = initialize_obsidia_x2dengine_x2dproof_x2dcore_Obsidia_Merkle(builtin);
if (lean_io_result_is_error(res)) return res;
lean_dec_ref(res);
res = initialize_obsidia_x2dengine_x2dproof_x2dcore_Obsidia_CryptoAssumptions(builtin);
if (lean_io_result_is_error(res)) return res;
lean_dec_ref(res);
lp_obsidia_x2dengine_x2dproof_x2dcore_Obsidia_Sensitivity_updateFile___closed__0 = _init_lp_obsidia_x2dengine_x2dproof_x2dcore_Obsidia_Sensitivity_updateFile___closed__0();
lean_mark_persistent(lp_obsidia_x2dengine_x2dproof_x2dcore_Obsidia_Sensitivity_updateFile___closed__0);
return lean_io_result_mk_ok(lean_box(0));
}
#ifdef __cplusplus
}
#endif
