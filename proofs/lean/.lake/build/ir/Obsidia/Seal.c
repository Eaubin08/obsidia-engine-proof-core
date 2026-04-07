// Lean compiler output
// Module: Obsidia.Seal
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
lean_object* lp_obsidia_x2dengine_x2dproof_x2dcore_Obsidia_SealAssumptions_combine(lean_object*);
LEAN_EXPORT lean_object* lp_obsidia_x2dengine_x2dproof_x2dcore_Obsidia_Seal_globalSeal(lean_object*, lean_object*);
LEAN_EXPORT lean_object* lp_obsidia_x2dengine_x2dproof_x2dcore_List_mapTR_loop___at___00Obsidia_Seal_rootHash_spec__0(lean_object*, lean_object*);
lean_object* l_List_reverse___redArg(lean_object*);
LEAN_EXPORT lean_object* lp_obsidia_x2dengine_x2dproof_x2dcore_Obsidia_Seal_rootHash(lean_object*);
LEAN_EXPORT lean_object* lp_obsidia_x2dengine_x2dproof_x2dcore_List_mapTR_loop___at___00Obsidia_Seal_rootHash_spec__0(lean_object* x_1, lean_object* x_2) {
_start:
{
if (lean_obj_tag(x_1) == 0)
{
lean_object* x_3; 
x_3 = l_List_reverse___redArg(x_2);
return x_3;
}
else
{
uint8_t x_4; 
x_4 = !lean_is_exclusive(x_1);
if (x_4 == 0)
{
lean_object* x_5; lean_object* x_6; lean_object* x_7; 
x_5 = lean_ctor_get(x_1, 0);
x_6 = lean_ctor_get(x_1, 1);
x_7 = lean_alloc_ctor(0, 1, 0);
lean_ctor_set(x_7, 0, x_5);
lean_ctor_set(x_1, 1, x_2);
lean_ctor_set(x_1, 0, x_7);
{
lean_object* _tmp_0 = x_6;
lean_object* _tmp_1 = x_1;
x_1 = _tmp_0;
x_2 = _tmp_1;
}
goto _start;
}
else
{
lean_object* x_9; lean_object* x_10; lean_object* x_11; lean_object* x_12; 
x_9 = lean_ctor_get(x_1, 0);
x_10 = lean_ctor_get(x_1, 1);
lean_inc(x_10);
lean_inc(x_9);
lean_dec(x_1);
x_11 = lean_alloc_ctor(0, 1, 0);
lean_ctor_set(x_11, 0, x_9);
x_12 = lean_alloc_ctor(1, 2, 0);
lean_ctor_set(x_12, 0, x_11);
lean_ctor_set(x_12, 1, x_2);
x_1 = x_10;
x_2 = x_12;
goto _start;
}
}
}
}
LEAN_EXPORT lean_object* lp_obsidia_x2dengine_x2dproof_x2dcore_Obsidia_Seal_rootHash(lean_object* x_1) {
_start:
{
lean_object* x_2; lean_object* x_3; lean_object* x_4; 
x_2 = lean_box(0);
x_3 = lp_obsidia_x2dengine_x2dproof_x2dcore_List_mapTR_loop___at___00Obsidia_Seal_rootHash_spec__0(x_1, x_2);
x_4 = lp_obsidia_x2dengine_x2dproof_x2dcore_Obsidia_SealAssumptions_combine(x_3);
return x_4;
}
}
LEAN_EXPORT lean_object* lp_obsidia_x2dengine_x2dproof_x2dcore_Obsidia_Seal_globalSeal(lean_object* x_1, lean_object* x_2) {
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
LEAN_EXPORT lean_object* initialize_obsidia_x2dengine_x2dproof_x2dcore_Obsidia_Seal(uint8_t builtin) {
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
return lean_io_result_mk_ok(lean_box(0));
}
#ifdef __cplusplus
}
#endif
