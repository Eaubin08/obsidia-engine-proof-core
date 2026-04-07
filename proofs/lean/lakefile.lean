import Lake
open Lake DSL

package «obsidia-engine-proof-core» where

lean_lib Obsidia where

@[default_target]
lean_exe obsidia where
  root := `Obsidia.Main