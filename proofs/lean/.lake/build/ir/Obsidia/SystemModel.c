// Lean compiler output
// Module: Obsidia.SystemModel
// Imports: public import Init public import Obsidia.Basic public import Obsidia.Sensitivity
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
LEAN_EXPORT uint8_t lp_obsidia_x2dengine_x2dproof_x2dcore_Obsidia_SystemModel_decideInstitutional(lean_object*);
LEAN_EXPORT uint8_t lp_obsidia_x2dengine_x2dproof_x2dcore_Obsidia_SystemModel_decide(lean_object*);
uint8_t lp_obsidia_x2dengine_x2dproof_x2dcore_Obsidia_decision(lean_object*, lean_object*);
uint8_t lp_obsidia_x2dengine_x2dproof_x2dcore_Obsidia_liftDecision(uint8_t);
LEAN_EXPORT lean_object* lp_obsidia_x2dengine_x2dproof_x2dcore_Obsidia_SystemModel_decide___boxed(lean_object*);
lean_object* l_List_appendTR___redArg(lean_object*, lean_object*);
LEAN_EXPORT lean_object* lp_obsidia_x2dengine_x2dproof_x2dcore_Obsidia_SystemModel_decideInstitutional___boxed(lean_object*);
LEAN_EXPORT lean_object* lp_obsidia_x2dengine_x2dproof_x2dcore_Obsidia_SystemModel_transition(lean_object*, lean_object*);
LEAN_EXPORT uint8_t lp_obsidia_x2dengine_x2dproof_x2dcore_Obsidia_SystemModel_decide(lean_object* x_1) {
_start:
{
lean_object* x_2; lean_object* x_3; uint8_t x_4; 
x_2 = lean_ctor_get(x_1, 0);
lean_inc_ref(x_2);
x_3 = lean_ctor_get(x_1, 1);
lean_inc_ref(x_3);
lean_dec_ref(x_1);
x_4 = lp_obsidia_x2dengine_x2dproof_x2dcore_Obsidia_decision(x_2, x_3);
return x_4;
}
}
LEAN_EXPORT lean_object* lp_obsidia_x2dengine_x2dproof_x2dcore_Obsidia_SystemModel_decide___boxed(lean_object* x_1) {
_start:
{
uint8_t x_2; lean_object* x_3; 
x_2 = lp_obsidia_x2dengine_x2dproof_x2dcore_Obsidia_SystemModel_decide(x_1);
x_3 = lean_box(x_2);
return x_3;
}
}
LEAN_EXPORT uint8_t lp_obsidia_x2dengine_x2dproof_x2dcore_Obsidia_SystemModel_decideInstitutional(lean_object* x_1) {
_start:
{
uint8_t x_2; uint8_t x_3; 
x_2 = lp_obsidia_x2dengine_x2dproof_x2dcore_Obsidia_SystemModel_decide(x_1);
x_3 = lp_obsidia_x2dengine_x2dproof_x2dcore_Obsidia_liftDecision(x_2);
return x_3;
}
}
LEAN_EXPORT lean_object* lp_obsidia_x2dengine_x2dproof_x2dcore_Obsidia_SystemModel_decideInstitutional___boxed(lean_object* x_1) {
_start:
{
uint8_t x_2; lean_object* x_3; 
x_2 = lp_obsidia_x2dengine_x2dproof_x2dcore_Obsidia_SystemModel_decideInstitutional(x_1);
x_3 = lean_box(x_2);
return x_3;
}
}
LEAN_EXPORT lean_object* lp_obsidia_x2dengine_x2dproof_x2dcore_Obsidia_SystemModel_transition(lean_object* x_1, lean_object* x_2) {
_start:
{
lean_object* x_3; lean_object* x_4; uint8_t x_5; 
x_3 = lean_ctor_get(x_2, 0);
lean_inc_ref(x_3);
x_4 = lean_ctor_get(x_2, 1);
lean_inc_ref(x_4);
x_5 = !lean_is_exclusive(x_1);
if (x_5 == 0)
{
lean_object* x_6; uint8_t x_7; lean_object* x_8; lean_object* x_9; lean_object* x_10; lean_object* x_11; lean_object* x_12; lean_object* x_13; 
x_6 = lean_ctor_get(x_1, 1);
x_7 = lp_obsidia_x2dengine_x2dproof_x2dcore_Obsidia_SystemModel_decide(x_2);
x_8 = lean_alloc_ctor(0, 2, 1);
lean_ctor_set(x_8, 0, x_3);
lean_ctor_set(x_8, 1, x_4);
lean_ctor_set_uint8(x_8, sizeof(void*)*2, x_7);
x_9 = lean_box(0);
x_10 = lean_alloc_ctor(1, 2, 0);
lean_ctor_set(x_10, 0, x_8);
lean_ctor_set(x_10, 1, x_9);
x_11 = l_List_appendTR___redArg(x_6, x_10);
lean_ctor_set(x_1, 1, x_11);
x_12 = lean_box(x_7);
x_13 = lean_alloc_ctor(0, 2, 0);
lean_ctor_set(x_13, 0, x_12);
lean_ctor_set(x_13, 1, x_1);
return x_13;
}
else
{
lean_object* x_14; lean_object* x_15; uint8_t x_16; lean_object* x_17; lean_object* x_18; lean_object* x_19; lean_object* x_20; lean_object* x_21; lean_object* x_22; lean_object* x_23; 
x_14 = lean_ctor_get(x_1, 0);
x_15 = lean_ctor_get(x_1, 1);
lean_inc(x_15);
lean_inc(x_14);
lean_dec(x_1);
x_16 = lp_obsidia_x2dengine_x2dproof_x2dcore_Obsidia_SystemModel_decide(x_2);
x_17 = lean_alloc_ctor(0, 2, 1);
lean_ctor_set(x_17, 0, x_3);
lean_ctor_set(x_17, 1, x_4);
lean_ctor_set_uint8(x_17, sizeof(void*)*2, x_16);
x_18 = lean_box(0);
x_19 = lean_alloc_ctor(1, 2, 0);
lean_ctor_set(x_19, 0, x_17);
lean_ctor_set(x_19, 1, x_18);
x_20 = l_List_appendTR___redArg(x_15, x_19);
x_21 = lean_alloc_ctor(0, 2, 0);
lean_ctor_set(x_21, 0, x_14);
lean_ctor_set(x_21, 1, x_20);
x_22 = lean_box(x_16);
x_23 = lean_alloc_ctor(0, 2, 0);
lean_ctor_set(x_23, 0, x_22);
lean_ctor_set(x_23, 1, x_21);
return x_23;
}
}
}
lean_object* initialize_Init(uint8_t builtin);
lean_object* initialize_obsidia_x2dengine_x2dproof_x2dcore_Obsidia_Basic(uint8_t builtin);
lean_object* initialize_obsidia_x2dengine_x2dproof_x2dcore_Obsidia_Sensitivity(uint8_t builtin);
static bool _G_initialized = false;
LEAN_EXPORT lean_object* initialize_obsidia_x2dengine_x2dproof_x2dcore_Obsidia_SystemModel(uint8_t builtin) {
lean_object * res;
if (_G_initialized) return lean_io_result_mk_ok(lean_box(0));
_G_initialized = true;
res = initialize_Init(builtin);
if (lean_io_result_is_error(res)) return res;
lean_dec_ref(res);
res = initialize_obsidia_x2dengine_x2dproof_x2dcore_Obsidia_Basic(builtin);
if (lean_io_result_is_error(res)) return res;
lean_dec_ref(res);
res = initialize_obsidia_x2dengine_x2dproof_x2dcore_Obsidia_Sensitivity(builtin);
if (lean_io_result_is_error(res)) return res;
lean_dec_ref(res);
return lean_io_result_mk_ok(lean_box(0));
}
#ifdef __cplusplus
}
#endif
